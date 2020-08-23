import { ArgumentType } from "discord.js-commando";
import memoizeOne from "memoize-one";

export const EFFECTIVENESS_ID = "effectiveness";
const EFFECTIVENESS_VALUES = [0, 0.25, 0.5, 1, 2, 4];
export const EFFECTIVENESS_PROMPT = `What is the effectiveness multiplier? This is one of: ${EFFECTIVENESS_VALUES.join(
  ", "
)}`;

const memoizeParseEffectiveness = memoizeOne((s: string): number | string => {
  const result = Number.parseFloat(s);
  if (!Number.isFinite(result)) {
    return `"${s}" is not a valid number!`;
  }
  if (!EFFECTIVENESS_VALUES.includes(result)) {
    return `${s} is not one of: ${EFFECTIVENESS_VALUES.join(", ")}`;
  }
  return result;
});

class EffectivenessType extends ArgumentType {
  parse = (s: string): number => {
    const result = memoizeParseEffectiveness(s);
    if (typeof result === "string") {
      throw new Error(result);
    }
    return result;
  };

  validate = (s: string) => {
    const result = memoizeParseEffectiveness(s);
    if (typeof result === "string") {
      return result;
    }
    return true;
  };
}

export default EffectivenessType;
