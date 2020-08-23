import arrayOf from "./arrayOf";
import PokemonType, { POKEMON_TYPE_ID } from "./pokemon";

export const POKEMON_ARRAY_PROMPT = "What are the names of the Pokémon?";
export const POKEMON_ARRAY_TYPE_ID = `${POKEMON_TYPE_ID}-array`;

const PokemonArrayType = arrayOf(PokemonType);

export default PokemonArrayType;
