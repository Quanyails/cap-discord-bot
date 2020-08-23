import { ArgumentType } from "discord.js-commando";
import memoizeOne from "memoize-one";

import { ELO_CUTOFFS } from "../util/usage";

export const ELO_CUTOFF_PROMPT = "What is the minimum ELO to look at?";
export const ELO_CUTOFF_ID = "elo-cutoff";

const memoizeParseEloCutoff = memoizeOne((s: string): number => {
  const result = Number.parseInt(s, 10);
  if (!Number.isFinite(result)) {
    throw new Error(`"${s}" is not a valid number!`);
  }
  if (!(ELO_CUTOFFS as [number, number, number, number]).includes(result)) {
    throw new Error(
      `${s} is not one of the following: ${ELO_CUTOFFS.join(", ")}`
    );
  }
  return result;
});

class EloCutoffType extends ArgumentType {
  parse = (s: string): number => {
    return memoizeParseEloCutoff(s);
  };

  validate = (s: string) => {
    try {
      memoizeParseEloCutoff(s);
      return true;
    } catch (e) {
      return e.message;
    }
  };
}

export default EloCutoffType;
