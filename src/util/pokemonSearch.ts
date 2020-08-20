import { Species } from "@pkmn/sim";
import _ from "lodash";

import getBestFuseMatch from "./fusePokemonSearch";
import getBestLunrMatch from "./lunrPokemonSearch";
import { getSpecies } from "./sim";
import { normalizeName } from "./string";

const transformSearchString = (str: string) => {
  const tokens = normalizeName(str)
    .split(" ")
    // Alias specifically-known tokens.
    // Pokemon Showdown! search aliases "Alolan X" to "X-Alola".
    // See: https://github.com/smogon/pokemon-showdown/blob/master/sim/dex.ts
    .map((token) => {
      switch (token) {
        case "alolan": {
          return "alola";
        }
        case "galarian": {
          return "galar";
        }
        case "gigantamax": {
          return "gmax";
        }
        default: {
          return token;
        }
      }
    });
  const uniqueTokens = _.uniq(tokens);

  // Sort the tokens by the following priority:
  // 1. species name
  // 2. region
  // 3. misc (usually forme)
  const getSortWeight = (s: string) => {
    if (getSpecies()[s]) {
      return 2 ** 2;
    }
    if (s === "alola" || s === "galar") {
      return 2 ** 1;
    }
    return 2 ** 0;
  };
  const sortedTokens = [...uniqueTokens].sort((s1, s2) => {
    return getSortWeight(s2) - getSortWeight(s1);
  });
  return sortedTokens.join(" ");
};

const searchPokemon = (str: string): Species | undefined => {
  const transformed = transformSearchString(str);
  return getBestFuseMatch(transformed) || getBestLunrMatch(transformed);
};

export default searchPokemon;
