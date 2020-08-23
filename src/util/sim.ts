import {
  Ability,
  Dex,
  DexTable,
  Format,
  Item,
  Move,
  Species,
  TypeInfo,
} from "@pkmn/sim";
import { Tier, TypeName } from "@pkmn/types";
import _ from "lodash";
import bsrCalculator from "pokemon-bsr";

import { filterDuplicates, filterIllegal } from "./simFilters";

export type AbilityId = keyof typeof Dex["data"]["Abilities"];
export type FormatId = keyof typeof Dex["data"]["Formats"];
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

const KEYS_TO_GETTERS = {
  Abilities: (a: string) => Dex.getAbility(a),
  Formats: (f: string) => Dex.getFormat(f),
  Items: (i: string) => Dex.getItem(i),
  Moves: (m: string) => Dex.getMove(m),
  Species: (s: string) => Dex.getSpecies(s),
  TypeChart: (t: string) => Dex.getType(t),
} as const;

const getData = _.memoize(
  <T extends ReturnType<typeof KEYS_TO_GETTERS[keyof typeof KEYS_TO_GETTERS]>>(
    key: keyof typeof KEYS_TO_GETTERS
  ) => {
    const { [key]: rawTable } = getRawDexData();
    const getter = KEYS_TO_GETTERS[key];
    const pairs = Object.keys(rawTable).map((id) => [id, getter(id)]);
    return Object.fromEntries(pairs) as DexTable<T>;
  }
);

export const getAbilities = () => {
  return getData<Ability>("Abilities");
};

export const getFormats = () => {
  return getData<Format>("Formats");
};

export const getItems = () => {
  return getData<Item>("Items");
};

export const getMoves = () => {
  return getData<Move>("Moves");
};

export const getSpecies = () => {
  return getData<Species>("Species");
};

export const getTiers = _.once(() => {
  return _.uniq(
    Object.values(getSpecies())
      .filter((f) => f.tier)
      .map((f) => f.tier)
  );
});

export const getTypeChart = () => {
  return getData<TypeInfo>("TypeChart");
};

const getEligiblePokemon = _.memoize((formatId: FormatId) => {
  const format = getFormats()[formatId];
  const ruleTable = Dex.getRuleTable(format);

  const species = getSpecies();
  const eligibleSpecies: Record<string, Species> = {};
  Object.entries(species).forEach(([id, s]) => {
    if (ruleTable.isBannedSpecies(s)) {
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
