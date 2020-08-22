import { Species } from "@pkmn/sim";
import { TypeName } from "@pkmn/types";
import { MessageEmbed } from "discord.js";
import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";

import {
  EFFECTIVENESS_ID,
  EFFECTIVENESS_PROMPT,
} from "../arguments/effectiveness";
import {
  POKEMON_ARRAY_PROMPT,
  POKEMON_ARRAY_TYPE_ID,
} from "../arguments/pokemonArray";
import { getBestCoverageTypes } from "../util/type";
import { PS_GROUP_ID } from "./psGroup";

const enum FindCoverageKey {
  Effectiveness = "effectiveness",
  NumTypes = "numTypes",
  PokemonArray = "pokemonArray",
}

type FindCoverageArgs = {
  [FindCoverageKey.Effectiveness]: number;
  [FindCoverageKey.NumTypes]: number;
  [FindCoverageKey.PokemonArray]: Species[];
};

class FindCoverageCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      args: [
        {
          key: FindCoverageKey.NumTypes,
          min: 1,
          max: 4,
          prompt: "How many move types do you want to find coverage for?",
          type: "integer",
        },
        {
          key: FindCoverageKey.Effectiveness,
          prompt: EFFECTIVENESS_PROMPT,
          type: EFFECTIVENESS_ID,
        },
        {
          key: FindCoverageKey.PokemonArray,
          prompt: POKEMON_ARRAY_PROMPT,
          type: POKEMON_ARRAY_TYPE_ID,
        },
      ],
      aliases: ["cover", "coverage"],
      description: "Finds type coverage against a set of Pokémon.",
      group: PS_GROUP_ID,
      memberName: "find-coverage",
      name: "find-coverage",
    });
  }

  // eslint-disable-next-line class-methods-use-this
  run = async (
    message: CommandoMessage,
    { effectiveness, numTypes, pokemonArray }: FindCoverageArgs
  ) => {
    const coverage = getBestCoverageTypes({
      minEffectiveness: effectiveness,
      numTypes,
      targetTypesList: pokemonArray.map((p) => p.types as TypeName[]),
    });
    const { numCovered } = coverage[0];

    if (numCovered === 0 || coverage.length === 0) {
      return message.reply("No results found!");
    }

    const embed = new MessageEmbed()
      .setTitle("Coverage results")
      .addField("# of move types", `${numTypes}`)
      .addField("Multiplier", `${effectiveness}×`);

    const chunkSize = 25;
    const limit = 2 * chunkSize;
    const maxResults = Math.min(limit, coverage.length);

    for (let start = 0; start < maxResults; start += chunkSize) {
      embed.addField(
        start === 0
          ? `${numCovered}/${pokemonArray.length} covered`
          : `${numCovered}/${pokemonArray.length} covered (cont.)`,
        coverage
          .slice(start, start + chunkSize)
          .map((c) => c.damageTypes.join(" + "))
          .join("\n"),
        true
      );
    }
    if (coverage.length > limit) {
      embed.setFooter(`(Showing only the first ${limit} results.)`);
    }

    return message.embed(embed);
  };
}

export default FindCoverageCommand;
