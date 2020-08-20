import { Species } from "@pkmn/sim";
import Fuse from "fuse.js";
import _ from "lodash";

import { getSpecies } from "./sim";
import { normalizeName } from "./string";

const getFuseIndex = _.once(() => {
  const normalizedPokemon = Object.values(getSpecies()).map((pokemon) => ({
    ...pokemon,
    name: normalizeName(pokemon.name),
  }));
  return new Fuse<Species>(normalizedPokemon, {
    keys: ["id", "name"] as (keyof Species)[],
    // lower fuzziness threshold to avoid false positive on Galarian Mr. Mime
    threshold: 0.3,
  });
});

const getBestFuseMatch = (str: string): Species | undefined => {
  const results = getFuseIndex().search(str);
  const bestKey = results[0]?.item.id;
  return getSpecies()[bestKey];
};

export default getBestFuseMatch;
