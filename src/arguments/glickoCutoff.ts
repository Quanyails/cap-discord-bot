import { ArgumentType } from "discord.js-commando";
import memoizeOne from "memoize-one";

import { GLICKO_CUTOFFS } from "../util/usage";

export const GLICKO_CUTOFF_PROMPT = "What is the minimum Glicko to look at?";
export const GLICKO_CUTOFF_ID = "glicko-cutoff";

const memoizeParseGlickoCutoff = memoizeOne((s: string): number => {
  const result = Number.parseInt(s, 10);
  if (!Number.isFinite(result)) {
    throw new Error(`"${s}" is not a valid number!`);
  }
  if (!(GLICKO_CUTOFFS as [number, number, number, number]).includes(result)) {
    throw new Error(
      `${s} is not one of the following: ${GLICKO_CUTOFFS.join(", ")}`
    );
  }
  return result;
});

class GlickoCutoffType extends ArgumentType {
  parse = (s: string): number => {
    return memoizeParseGlickoCutoff(s);
  };

  validate = (s: string) => {
    try {
      memoizeParseGlickoCutoff(s);
      return true;
    } catch (e) {
      return e.message;
    }
  };
}

export default GlickoCutoffType;
