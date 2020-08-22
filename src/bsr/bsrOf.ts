import { Species } from "@pkmn/sim";
import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";

import { POKEMON_PROMPT, POKEMON_TYPE_ID } from "../arguments/pokemon";
import getBsrEmbed from "../util/bsrEmbed";
import { getBsrMetagame } from "../util/sim";
import { BSR_GROUP_ID } from "./bsrGroup";

const BSR_OF_KEY = "pokemon";
type BsrOfValue = Species;

class BsrOfCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      args: [
        {
          key: BSR_OF_KEY,
          prompt: POKEMON_PROMPT,
          type: POKEMON_TYPE_ID,
        },
      ],
      aliases: [],
      description:
        "Calculates a Pokémon's BSR (Base Stat Rating), given its name.",
      group: BSR_GROUP_ID,
      memberName: "bsr-of",
      name: "bsr-of",
    });
  }

  // eslint-disable-next-line class-methods-use-this
  run = async (
    message: CommandoMessage,
    { pokemon: species }: Record<typeof BSR_OF_KEY, BsrOfValue>
  ) => {
    const bsr = getBsrMetagame().getBsr(species.baseStats);
    const bsrEmbed = getBsrEmbed({
      bsr,
      stats: species.baseStats,
    });
    return message.embed(bsrEmbed);
  };
}

export default BsrOfCommand;
