import { Dex, DexTable, Species } from "@pkmn/sim";
import { Tier } from "@pkmn/types";
import _ from "lodash";
import bsrCalculator from "pokemon-bsr";

import { filterDuplicates, filterIllegal } from "./simFilters";

type FormatId = keyof typeof Dex["dexes"];

export const CURRENT_GEN = "gen8";

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
