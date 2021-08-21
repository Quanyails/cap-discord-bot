import { Format } from "@pkmn/sim";
import { ArgumentType } from "discord.js-commando";
import memoizeOne from "memoize-one";

import { CURRENT_GEN, getFormats } from "../util/sim";
import { normalize } from "../util/string";

export const FORMAT_PROMPT =
  "What is the name of the format on Pokémon Showdown?";
export const FORMAT_TYPE_ID = "format";

const memoizeGetFormat = memoizeOne((s: string): Format | undefined => {
  const formats = getFormats();
  const normalized = normalize(s);
  const longhand = `${CURRENT_GEN}${normalized}`;
  return formats[normalized] ?? formats[longhand];
});

class FormatType extends ArgumentType {
  parse = (s: string): Format => {
    const result = memoizeGetFormat(s);
    if (result === undefined) {
      throw new Error(`Format "${s}" not found!`);
    }
    return result;
  };

  validate = (s: string) => {
    const result = memoizeGetFormat(s);
    if (result === undefined) {
      return `Format "${s}" not found!`;
    }
    return true;
  };
}

export default FormatType;
