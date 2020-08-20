import { Species } from "@pkmn/sim";
import _ from "lodash";
import { Builder } from "lunr";

import { getSpecies } from "./sim";
import { normalizeName } from "./string";

const getLunrIndex = _.once(() => {
  const normalizedPokemon = Object.values(getSpecies()).map((pokemon) => ({
    ...pokemon,
    name: normalizeName(pokemon.name),
  }));

  // Helpful resource for customizing Lunr:
  // https://gabriele-decapoa.github.io/2019/08/25/lun_js-optimization-for-jekyll/
  const lunrBuilder = new Builder();
  lunrBuilder.field("name");
  lunrBuilder.ref("id");
  normalizedPokemon.forEach((pokemon) => {
    lunrBuilder.add(pokemon);
  });
  return lunrBuilder.build();
});

const getBestLunrMatch = (str: string): Species | undefined => {
  const results = getLunrIndex().search(str);
  const bestKey = results[0]?.ref;
  return getSpecies()[bestKey];
};

export default getBestLunrMatch;
