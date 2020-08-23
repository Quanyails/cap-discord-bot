import { Format, Species } from "@pkmn/sim";
import { MessageEmbed } from "discord.js";
import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";

import { FORMAT_PROMPT, FORMAT_TYPE_ID } from "../arguments/format";
import {
  GLICKO_CUTOFF_ID,
  GLICKO_CUTOFF_PROMPT,
} from "../arguments/glickoCutoff";
import { POKEMON_PROMPT, POKEMON_TYPE_ID } from "../arguments/pokemon";
import { getAbilities, getItems, getMoves } from "../util/sim";
import {
  getGlickoCutoffs,
  getLatestUsageYearMonth,
  getUsage,
  GLICKO_CUTOFFS,
  SpeciesUsage,
} from "../util/usage";
import { formatFrequency } from "../util/usageFormat";
import { PS_GROUP_ID } from "./psGroup";

const enum UsagePokemonKey {
  Glicko = "glicko",
  FormatKey = "format",
  Pokemon = "pokemon",
}

type UsagePokemonArgs = {
  [UsagePokemonKey.Glicko]: typeof GLICKO_CUTOFFS[number];
  [UsagePokemonKey.FormatKey]: Format;
  [UsagePokemonKey.Pokemon]: Species;
};

type SpeciesUsageKey = "Abilities" | "Items" | "Moves" | "Spreads";

type UsageSection<T extends SpeciesUsageKey> = {
  cutoff: number;
  dataKey: T;
  fieldName: string;
  getName: (id: keyof SpeciesUsage[T]) => string;
};

const sectionOrder: UsageSection<SpeciesUsageKey>[] = [
  {
    cutoff: Infinity,
    dataKey: "Abilities",
    fieldName: "Abilities",
    getName: (id: keyof SpeciesUsage["Abilities"]) => getAbilities()[id].name,
  },
  {
    cutoff: 5,
    dataKey: "Items",
    fieldName: "Items",
    getName: (id: keyof SpeciesUsage["Items"]) => {
      return id === "nothing" ? "Nothing" : getItems()[id].name;
    },
  },
  {
    cutoff: 5,
    dataKey: "Spreads",
    getName: (id: keyof SpeciesUsage["Spreads"]) => id,
    fieldName: "Spreads",
  },
  {
    cutoff: 10,
    dataKey: "Moves",
    fieldName: "Moves",
    getName: (id: keyof SpeciesUsage["Moves"]) => {
      return id === "" ? "(No move)" : getMoves()[id].name;
    },
  },
];

const buildEmbed = ({
  glicko,
  speciesData,
  usageYearMonth,
}: {
  glicko: typeof GLICKO_CUTOFFS[number];
  speciesData: SpeciesUsage;
  usageYearMonth: Date;
}) => {
  const { usage } = speciesData;

  // Don't use speciesData["Raw count"], since that doesn't scale for Glicko > 0.
  const rawCount = Object.values(speciesData.Abilities).reduce(
    (acc, n) => acc + n,
    0
  );

  const titleParts = [
    // HACK: Use en-CA locale for getting YYYY-MM date format.
    `Usage stats from ${usageYearMonth
      .toLocaleDateString("en-CA")
      .slice(0, 7)}`,
  ];
  if (glicko > 0) {
    titleParts.push(`(Glicko-2 = ${glicko})`);
  }

  const embed = new MessageEmbed()
    .setTitle(titleParts.join(" "))
    .addField("Usage", `${(100 * usage).toFixed(2)}%`, true);

  sectionOrder.forEach(({ cutoff, dataKey, fieldName, getName }) => {
    const freq = speciesData[dataKey];
    const mappedFreq = Object.fromEntries(
      Object.entries(freq).map(([id, n]) => [getName(id), n / rawCount])
    );
    embed.addField(
      fieldName,
      formatFrequency({
        asPercent: true,
        cutoff,
        frequency: mappedFreq,
        sort: "descending",
      })
    );
  });
  return embed;
};

class UsagePokemonCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      args: [
        {
          key: UsagePokemonKey.Pokemon,
          prompt: POKEMON_PROMPT,
          type: POKEMON_TYPE_ID,
        },
        {
          key: UsagePokemonKey.FormatKey,
          prompt: FORMAT_PROMPT,
          type: FORMAT_TYPE_ID,
        },
        {
          default: 0,
          key: UsagePokemonKey.Glicko,
          prompt: GLICKO_CUTOFF_PROMPT,
          type: GLICKO_CUTOFF_ID,
        },
      ],
      aliases: ["usage"],
      description: "Gets the latest usage information on Pokémon in a format.",
      group: PS_GROUP_ID,
      memberName: "usage-pokemon",
      name: "usage-pokemon",
    });
  }

  // eslint-disable-next-line class-methods-use-this
  run = async (
    message: CommandoMessage,
    { format, glicko, pokemon }: UsagePokemonArgs
  ) => {
    const validGlickoCutoffs = getGlickoCutoffs(format);
    if (!(validGlickoCutoffs as readonly number[]).includes(glicko)) {
      return message.reply(
        [
          `${format.id} is not compatible with Glicko-2 = ${glicko}.`,
          `(Supported values: ${validGlickoCutoffs.join(", ")})`,
        ].join(" ")
      );
    }

    const loadingMessage = await message.reply("Loading...");

    (async () => {
      if (Array.isArray(loadingMessage)) {
        throw new Error(
          `Tried to send multiple messages in response to "${message.argString}".`
        );
      }

      const usageYearMonth = getLatestUsageYearMonth();
      const { data } = await getUsage({
        date: usageYearMonth,
        format: format.id,
        glicko,
      });

      const speciesData = data[pokemon.name];
      if (speciesData) {
        loadingMessage.edit(
          "",
          buildEmbed({
            glicko,
            speciesData,
            usageYearMonth,
          })
        );
      } else {
        loadingMessage.edit("No results found!");
      }
    })();
    return loadingMessage;
  };
}

export default UsagePokemonCommand;
