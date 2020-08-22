import { Species } from "@pkmn/sim";
import { Tier } from "@pkmn/types";
import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";

import { POKEMON_PROMPT, POKEMON_TYPE_ID } from "../arguments/pokemon";
import { TIER_PROMPT, TIER_TYPE_ID } from "../arguments/tier";
import getBsrEmbed from "../util/bsrEmbed";
import { getTierMetagame } from "../util/sim";
import { BSR_GROUP_ID } from "./bsrGroup";

type TierBsrOfKey = "pokemon" | "tier";
type TierBsrOfValue = Species;

class TierBsrOfCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      args: [
        {
          key: "tier" as TierBsrOfKey,
          prompt: TIER_PROMPT,
          type: TIER_TYPE_ID,
        },
        {
          key: "pokemon" as TierBsrOfKey,
          prompt: POKEMON_PROMPT,
          type: POKEMON_TYPE_ID,
        },
      ],
      aliases: ["bsr-tier-of", "tier-bsr-of"],
      description:
        "Calculates a Pokémon BSR (Base Stat Rating) relative to a tier, given its name.",
      group: BSR_GROUP_ID,
      memberName: "tier-bsr-of",
      name: "tier-bsr-of",
    });
  }

  // eslint-disable-next-line class-methods-use-this
  run = async (
    message: CommandoMessage,
    {
      pokemon: species,
      tier,
    }: {
      pokemon: TierBsrOfValue;
      tier: Tier.Singles | Tier.Doubles | Tier.Other;
    }
  ) => {
    const bsr = getTierMetagame(tier).getBsr(species.baseStats);
    const bsrEmbed = getBsrEmbed({
      bsr,
      name: tier,
      stats: species.baseStats,
    });
    return message.embed(bsrEmbed);
  };
}

export default TierBsrOfCommand;
