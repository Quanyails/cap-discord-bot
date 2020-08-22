import { Species } from "@pkmn/sim";
import { ArgumentType } from "discord.js-commando";
import memoizeOne from "memoize-one";

import searchPokemon from "../util/pokemonSearch";

export const POKEMON_PROMPT = "What is the name of the Pokémon?";
export const POKEMON_TYPE_ID = "pokemon";

const memoizeSearchPokemon = memoizeOne((s: string): Species | undefined => {
  return searchPokemon(s);
});

class PokemonType extends ArgumentType {
  parse = (s: string): Species => {
    const result = memoizeSearchPokemon(s);
    if (result === undefined) {
      throw new Error(`Pokémon "${s}" not found!`);
    }
    return result;
  };

  validate = (s: string) => {
    const result = memoizeSearchPokemon(s);
    if (result === undefined) {
      return `Pokémon "${s}" not found!`;
    }
    return true;
  };
}

export default PokemonType;
