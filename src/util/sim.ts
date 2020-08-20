import { Dex, DexTable, Species } from "@pkmn/sim";
import _ from "lodash";

const getRawDexData = _.once(() => {
  return Dex.loadData();
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
