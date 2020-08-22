import { Tier } from "@pkmn/types";
import { ArgumentType } from "discord.js-commando";
import memoizeOne from "memoize-one";

import { getTiers } from "../util/sim";
import { normalize } from "../util/string";

export const TIER_PROMPT = "What is the name of the tier on Pokémon Showdown?";
export const TIER_TYPE_ID = "tier";

const memoizedGetTier = memoizeOne((s: string):
  | Tier.Singles
  | Tier.Doubles
  | Tier.Other
  | undefined => {
  const normalized = normalize(s);
  const tier = getTiers().find(
    (t) =>
      normalize(t, {
        preserveParentheses: true,
      }) === normalized
  );
  if (tier) {
    return tier as Tier.Singles | Tier.Doubles | Tier.Other;
  }
  return undefined;
});

class TierType extends ArgumentType {
  parse = (s: string): Tier.Singles | Tier.Doubles | Tier.Other => {
    const tier = memoizedGetTier(s);
    if (tier === undefined) {
      throw new Error(`Tier "${s}" not found!`);
    }
    return tier;
  };

  validate = (s: string) => {
    const tier = memoizedGetTier(s);
    if (tier === undefined) {
      return `Tier "${s}" not found!`;
    }
    return true;
  };
}

export default TierType;
