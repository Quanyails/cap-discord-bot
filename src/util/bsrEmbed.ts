import { MessageEmbed } from "discord.js";
import { BsrCalculator } from "pokemon-bsr/dist/src/bsr";

import { PREFIX } from "../prefix";
import {
  formatBsr,
  formatStats,
  formatSweepinessTankiness,
} from "./pokedexFormat";

const getBsrEmbed = ({
  bsr,
  stats,
}: {
  bsr: ReturnType<BsrCalculator["getBsr"]>;
  stats: Parameters<BsrCalculator["getBsr"]>[0];
}) => {
  return new MessageEmbed()
    .setTitle("Base Stat Rating")
    .addField("Stats", formatStats(stats))
    .addField("Sweepiness/Tankiness", formatSweepinessTankiness(bsr))
    .addField("ODB", `${formatBsr(bsr.odb)}`, true)
    .addField("PSB", `${formatBsr(bsr.psb)}`, true)
    .addField("Overall Rating", `${formatBsr(bsr.or)}`, true)
    .setFooter(
      `Confused? Use the command ${PREFIX}bsr-about for more information.`
    );
};

export default getBsrEmbed;
