import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";

import getBsrEmbed from "../util/bsrEmbed";
import { BSR_MAX, BSR_MIN } from "../util/pokedexFormat";
import { getBsrMetagame } from "../util/sim";
import { BSR_GROUP_ID } from "./bsrGroup";

const enum BsrKey {
  HP = "hp",
  ATK = "atk",
  DEF = "def",
  SPA = "spa",
  SPD = "spd",
  SPE = "spe",
}
type BsrValue = number;

const isBaseStat = (stat: BsrValue) => {
  if (BSR_MIN <= stat && stat <= BSR_MAX) {
    return true;
  }
  return `Value must be between ${BSR_MIN} and ${BSR_MAX}.`;
};

const argData: {
  key: BsrKey;
  name: string;
}[] = [
  {
    key: BsrKey.HP,
    name: "HP",
  },
  {
    key: BsrKey.ATK,
    name: "Attack",
  },
  {
    key: BsrKey.DEF,
    name: "Defense",
  },
  {
    key: BsrKey.SPA,
    name: "Special Attack",
  },
  {
    key: BsrKey.SPD,
    name: "Special Defense",
  },
  {
    key: BsrKey.SPE,
    name: "Speed",
  },
];

class BsrCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      args: argData.map(({ key, name }) => ({
        key,
        max: BSR_MAX,
        min: BSR_MIN,
        prompt: `What is the base ${name} of the Pokémon?`,
        type: "integer",
        validate: isBaseStat,
      })),
      aliases: [],
      description:
        "Calculates a Pokémon BSR (Base Stat Rating), given its base stats.",
      group: BSR_GROUP_ID,
      memberName: "bsr",
      name: "bsr",
    });
  }

  // eslint-disable-next-line class-methods-use-this
  run = async (message: CommandoMessage, stats: Record<BsrKey, BsrValue>) => {
    const bsr = getBsrMetagame().getBsr(stats);
    const bsrEmbed = getBsrEmbed({ bsr, stats });
    return message.embed(bsrEmbed);
  };
}

export default BsrCommand;
