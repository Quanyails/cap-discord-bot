import { Format, Species } from "@pkmn/sim";
import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";

import { FORMAT_PROMPT, FORMAT_TYPE_ID } from "../arguments/format";
import { POKEMON_PROMPT, POKEMON_TYPE_ID } from "../arguments/pokemon";
import getBsrEmbed from "../util/bsrEmbed";
import { getFormatMetagame, getFormats } from "../util/sim";
import { BSR_GROUP_ID } from "./bsrGroup";

type FormatBsrOfKey = "format" | "pokemon";
type FormatBsrOfValue = Species;

class FormatBsrOfCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      args: [
        {
          key: "format" as FormatBsrOfKey,
          prompt: FORMAT_PROMPT,
          oneOf: Object.values(getFormats())
            .filter((f) => f.effectType === "Format")
            .map((f) => f.id),
          type: FORMAT_TYPE_ID,
        },
        {
          key: "pokemon" as FormatBsrOfKey,
          prompt: POKEMON_PROMPT,
          type: POKEMON_TYPE_ID,
        },
      ],
      aliases: ["bsr-format-of"],
      description:
        "Calculates a Pokémon BSR (Base Stat Rating) relative to a format, given its name.",
      group: BSR_GROUP_ID,
      memberName: "format-bsr-of",
      name: "format-bsr-of",
    });
  }

  // eslint-disable-next-line class-methods-use-this
  run = async (
    message: CommandoMessage,
    {
      format,
      pokemon: species,
    }: {
      format: Format;
      pokemon: FormatBsrOfValue;
    }
  ) => {
    const bsr = getFormatMetagame(format.id).getBsr(species.baseStats);
    const bsrEmbed = getBsrEmbed({
      bsr,
      name: format.name,
      stats: species.baseStats,
    });
    return message.embed(bsrEmbed);
  };
}

export default FormatBsrOfCommand;
