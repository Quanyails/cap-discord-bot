import { MessageEmbed } from "discord.js";
import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { BsrCalculator } from "pokemon-bsr/dist/src/bsr";

import { normalize } from "../util/string";
import { BSR_GROUP_ID } from "./bsrGroup";

type BsrKey = keyof ReturnType<BsrCalculator["getBsr"]>;

const BSR_ABOUT_KEY = "val";
const BSR_ABOUT_VALUE_ALL = "all";
type BsrAboutValue = BsrKey | typeof BSR_ABOUT_VALUE_ALL;

type BsrProps = {
  name: string;
  description: string;
  μ: number;
  σ: number;
};

const bsrProps: Record<BsrKey, BsrProps> = {
  ps: {
    name: "PS (Physical Sweepiness)",
    description:
      "How physically offensive a Pokémon is compared to the average Pokémon.",
    μ: 100,
    σ: 50,
  },
  pt: {
    name: "PT (Physical Tankiness)",
    description:
      "How physically defensive a Pokémon is compared to the average Pokémon.",
    μ: 100,
    σ: 50,
  },
  ss: {
    name: "Special (Special Sweepiness)",
    description:
      "How specially offensive a Pokémon is compared to the average Pokémon.",
    μ: 100,
    σ: 50,
  },
  st: {
    name: "ST (Special Sweepiness)",
    description:
      "How specially defensive a Pokémon is compared to the average Pokémon.",
    μ: 100,
    σ: 50,
  },
  odb: {
    name: "ODB (Offensive/Defensive Bias)",
    description: `
How offensively/defensively-leaning a Pokémon is compared to the average Pokémon.
- Positive numbers indicate an offensive bias.
- Negative numbers indicate a defensive bias.
`.trim(),
    μ: 100,
    σ: 50,
  },
  psb: {
    name: "PSB (Physical/Special Bias)",
    description: `
How physically/specially-leaning a Pokémon is compared to the average Pokémon.
- Positive numbers indicate a physical bias.
- Negative numbers indicate a special bias.
`.trim(),
    μ: 100,
    σ: 50,
  },
  or: {
    name: "Overall Rating",
    description: "Combines PS/PT/SS/ST.",
    μ: 200,
    σ: 100,
  },
};

const explainProps = ({ μ, σ }: BsrProps) => {
  return `
- ${μ} is average
- 68% of all Pokémon fall between [${μ - σ}, ${μ + σ}]
- 95% of all Pokémon fall between [${μ - 2 * σ}, ${μ + 2 * σ}]
~ almost all Pokémon fall between [${μ - 3 * σ}, ${μ + 3 * σ}]
`.trim();
};

class BsrAboutCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      args: [
        {
          default: BSR_ABOUT_VALUE_ALL,
          key: BSR_ABOUT_KEY,
          oneOf: [...Object.keys(bsrProps), BSR_ABOUT_VALUE_ALL],
          parse: (s: string) => normalize(s),
          prompt: "Which BSR value would you like to learn more about?",
          type: "string",
        },
      ],
      aliases: ["about-bsr", "bsr-help", "help-bsr"],
      description: "Explains what BSR values mean.",
      group: BSR_GROUP_ID,
      memberName: "bsr-about",
      name: "bsr-about",
    });
  }

  // eslint-disable-next-line class-methods-use-this
  run = async (
    message: CommandoMessage,
    { val }: Record<typeof BSR_ABOUT_KEY, BsrAboutValue>
  ) => {
    const embed = new MessageEmbed()
      .setTitle("Base Stat Rating")
      .setURL("https://github.com/Quanyails/pokemon-bsr/blob/master/README.md");

    if (val === BSR_ABOUT_VALUE_ALL) {
      (["ps", "pt", "ss", "st", "odb", "psb", "or"] as const).forEach((s) => {
        const props = bsrProps[s];
        embed.addField(
          props.name,
          `
${props.description}
${explainProps(props)}
`.trim()
        );
      });
    } else {
      const props = bsrProps[val];
      embed.addField(
        props.name,
        `
${props.description}
${explainProps(props)}
`.trim()
      );
    }

    return message.embed(embed);
  };
}

export default BsrAboutCommand;
