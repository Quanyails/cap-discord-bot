import {
  Ability,
  Dex,
  Format,
  Item,
  Move,
  Species,
  toID,
  TypeInfo,
} from "@pkmn/sim";
import { Tier, TypeName } from "@pkmn/types";
import _ from "lodash";
import memoizeOne from "memoize-one";
import bsrCalculator from "pokemon-bsr";

import { filterDuplicates, filterIllegal } from "./simFilters";

// Copy of @pkmn/sim's DexTable
export interface DexTable<T> {
  [key: string]: T;
}

export type AbilityId = keyof typeof Dex["data"]["Abilities"];
export type FormatId = keyof typeof Dex["data"]["FormatsData"];
export type ItemId = keyof typeof Dex["data"]["Items"];
export type MoveId = keyof typeof Dex["data"]["Moves"];
export type SpeciesName = Species["name"];

export const CURRENT_GEN = "gen8";

const EFFECTIVENESS_TO_MULTIPLIER = {
  0: 1,
  1: 2,
  2: 0.5,
  3: 0,
};

const getRawDexData = _.once(() => {
  return Dex.loadData();
});

export const getAbilities = memoizeOne(() => {
  const { Abilities } = getRawDexData();
  const pairs = Object.keys(Abilities).map((id) => [id, Dex.abilities.get(id)]);
  return Object.fromEntries(pairs) as DexTable<Ability>;
});

export const getFormats = memoizeOne(() => {
  const rulesetsCache = Dex.formats.rulesetCache;
  const pairs = Array.from(rulesetsCache.keys()).map((id) => [
    id,
    Dex.formats.rulesetCache.get(toID(id)),
  ]);
  return Object.fromEntries(pairs) as DexTable<Format>;
});

export const getItems = memoizeOne(() => {
  const { Items } = getRawDexData();
  const pairs = Object.keys(Items).map((id) => [id, Dex.items.get(id)]);
  return Object.fromEntries(pairs) as DexTable<Item>;
});

export const getMoves = memoizeOne(() => {
  const { Moves } = getRawDexData();
  const pairs = Object.keys(Moves).map((id) => [id, Dex.moves.get(id)]);
  return Object.fromEntries(pairs) as DexTable<Move>;
});

export const getSpecies = memoizeOne(() => {
  // eslint-disable-next-line no-shadow
  const { Species } = getRawDexData();
  const pairs = Object.keys(Species).map((id) => [id, Dex.species.get(id)]);
  return Object.fromEntries(pairs) as DexTable<Species>;
});

export const getTiers = memoizeOne(() => {
  return _.uniq(
    Object.values(getSpecies())
      .filter((f) => f.tier)
      .map((f) => f.tier)
  );
});

export const getTypeChart = memoizeOne(() => {
  const { TypeChart } = getRawDexData();
  const pairs = Object.keys(TypeChart).map((id) => [id, Dex.types.get(id)]);
  return Object.fromEntries(pairs) as DexTable<TypeInfo>;
});

const getEligiblePokemon = memoizeOne((formatId: FormatId) => {
  const format = getFormats()[formatId];

  const species = getSpecies();
  const eligibleSpecies: Record<string, Species> = {};
  Object.entries(species).forEach(([id, s]) => {
    if (format.ruleTable?.isBannedSpecies(s)) {
      return;
    }
    eligibleSpecies[id] = s;
  });
  return eligibleSpecies;
});

export const getEffectiveness = ({
  damageType,
  targetType,
  type,
}: {
  damageType: TypeName;
  targetType: TypeName;
  type: "attacking" | "defending";
}) => {
  const typeChart = getTypeChart();
  const damageTakenFlag = (() => {
    switch (type) {
      case "attacking": {
        return typeChart[targetType].damageTaken[damageType];
      }
      case "defending": {
        return typeChart[damageType].damageTaken[targetType];
      }
      default: {
        throw new Error(`Unexpected value for type: ${type}`);
      }
    }
  })() as keyof typeof EFFECTIVENESS_TO_MULTIPLIER;
  return EFFECTIVENESS_TO_MULTIPLIER[damageTakenFlag];
};

export const getFormatMetagame = _.memoize((formatId: FormatId) => {
  // Order of filters is important
  const initialSpecies = getEligiblePokemon(formatId);
  const eligibleSpecies = filterIllegal(initialSpecies);
  const uniqueSpecies = filterDuplicates(eligibleSpecies);
  return bsrCalculator({
    statsList: Object.values(uniqueSpecies).map((species) => species.baseStats),
  });
});

export const getTierMetagame = _.memoize(
  (tierName: Tier.Singles | Tier.Doubles | Tier.Other) => {
    // Order of filters is important
    const initialSpecies = getSpecies();
    const tierSpecies: DexTable<Species> = {};
    Object.entries(initialSpecies).forEach(([id, species]) => {
      if (species.tier === tierName) {
        tierSpecies[id] = species;
      }
    });
    const eligibleSpecies = filterIllegal(tierSpecies);
    const uniqueSpecies = filterDuplicates(eligibleSpecies);
    return bsrCalculator({
      statsList: Object.values(uniqueSpecies).map(
        (species) => species.baseStats
      ),
    });
  }
);

export const getBsrMetagame = _.once(() => {
  return getFormatMetagame("gen8anythinggoes");
});
