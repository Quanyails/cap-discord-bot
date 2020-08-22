import { Dex, DexTable, Species, TypeInfo } from "@pkmn/sim";
import { Tier, TypeName } from "@pkmn/types";
import _ from "lodash";
import bsrCalculator from "pokemon-bsr";

import { filterDuplicates, filterIllegal } from "./simFilters";

type FormatId = keyof typeof Dex["dexes"];

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

export const getFormats = _.once(() => {
  const { Formats: rawFormats } = getRawDexData();

  return Object.fromEntries(
    Object.keys(rawFormats).map((rawFormat) => [
      rawFormat,
      Dex.getFormat(rawFormat),
    ])
  );
});

export const getSpecies = _.once(() => {
  const { Species: rawSpecies } = getRawDexData();

  return Object.fromEntries(
    Object.keys(rawSpecies).map((rawSpeciesId) => [
      rawSpeciesId,
      Dex.getSpecies(rawSpeciesId),
    ])
  ) as DexTable<Species>;
});

export const getTiers = _.once(() => {
  return _.uniq(
    Object.values(getSpecies())
      .filter((f) => f.tier)
      .map((f) => f.tier)
  );
});

export const getTypeChart = _.once(() => {
  const { TypeChart: rawTypeChart } = getRawDexData();

  return Object.fromEntries(
    Object.keys(rawTypeChart).map((rawTypeId) => {
      return [rawTypeId, Dex.getType(rawTypeId)];
    })
  ) as DexTable<TypeInfo>;
});

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
