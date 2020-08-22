import { Species } from "@pkmn/sim";
import { MessageEmbed } from "discord.js";
import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";

import { POKEMON_PROMPT, POKEMON_TYPE_ID } from "../arguments/pokemon";
import {
  formatAbilities,
  formatStats,
  formatTypes,
} from "../util/pokedexFormat";
import { getAnalysisUrl, getImageUrl } from "../util/showdown";
import { PS_GROUP_ID } from "./psGroup";

const enum DexSearchKey {
  Pokemon = "pokemon",
}
type DexSearchArgs = {
  [DexSearchKey.Pokemon]: Species;
};

class DexSearchCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      args: [
        {
          key: DexSearchKey.Pokemon,
          prompt: POKEMON_PROMPT,
          type: POKEMON_TYPE_ID,
        },
      ],
      aliases: ["dex", "dexsearch", "pokedex"],
      description: "Gets Pokédex information on a Pokémon.",
      group: PS_GROUP_ID,
      memberName: "dex-search",
      name: "dex-search",
    });
  }

  // eslint-disable-next-line class-methods-use-this
  run = async (
    message: CommandoMessage,
    { pokemon: species }: DexSearchArgs
  ) => {
    const embed = new MessageEmbed()
      .setTitle(species.name)
      .setThumbnail(getImageUrl(species.spriteid))
      .addField(
        species.types.length === 1 ? "Type" : "Types",
        formatTypes(species.types),
        true
      )
      .addField(
        Object.keys(species.abilities).length === 1 ? "Ability" : "Abilities",
        formatAbilities(species.abilities),
        true
      )
      .addField("Stats", formatStats(species.baseStats));

    if (species.tier) {
      embed.addField("Tier", species.tier, true);
    }
    embed.addField("Analysis", `[link](${getAnalysisUrl(species.name)})`, true);
    if (species.isNonstandard === "Past") {
      embed.addField("Notes:", "- Past-gen only");
    }
    return message.embed(embed);
  };
}

export default DexSearchCommand;
