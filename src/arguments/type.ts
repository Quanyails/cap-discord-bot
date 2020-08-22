import { TypeName } from "@pkmn/types";
import { ArgumentType } from "discord.js-commando";
import memoizeOne from "memoize-one";

import { getTypeChart } from "../util/sim";
import { normalize } from "../util/string";

export const TYPE_PROMPT = "What is the Pokémon type?";
export const TYPE_TYPE_ID = "type";

const memoizedGetType = memoizeOne((s: string): TypeName | undefined => {
  const normalized = normalize(s);
  const titlecased = `${normalized.slice(0, 1).toUpperCase()}${normalized
    .slice(1)
    .toLowerCase()}`;
  if (getTypeChart()[titlecased]) {
    return normalized as TypeName;
  }
  return undefined;
});

class TypeType extends ArgumentType {
  parse = (s: string): TypeName => {
    const result = memoizedGetType(s);
    if (result === undefined) {
      throw new Error(`Type "${s}" not found!`);
    }
    return result;
  };

  validate = (s: string) => {
    const result = memoizedGetType(s);
    if (result === undefined) {
      return `Type "${s}" not found!`;
    }
    return true;
  };
}

export default TypeType;
