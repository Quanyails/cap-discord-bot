import { Intents } from "discord.js";
import { CommandGroup, CommandoClient } from "discord.js-commando";

import PokemonType, { POKEMON_TYPE_ID } from "./arguments/pokemon";
import BsrCommand from "./bsr/bsr";
import BsrAboutCommand from "./bsr/bsrAbout";
import { BSR_GROUP_ID } from "./bsr/bsrGroup";
import BsrOfCommand from "./bsr/bsrOf";
import { CAP_GROUP_ID } from "./cap/capGroup";
import TestServerCommand from "./cap/testServer";
import { PREFIX } from "./prefix";
import DexSearchCommand from "./ps/dexSearch";
import { PS_GROUP_ID } from "./ps/psGroup";

const init = async () => {
  const intents = new Intents([
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
  ]);
  const client = new CommandoClient({
    commandPrefix: PREFIX,
    owner: "259082173271769109",
    ws: {
      intents,
    },
  });
  client.registry
    .registerDefaults()
    .registerGroup(new CommandGroup(client, BSR_GROUP_ID, "BSR"))
    .registerGroup(new CommandGroup(client, CAP_GROUP_ID, "CAP"))
    .registerGroup(new CommandGroup(client, PS_GROUP_ID, "PS"))
    .registerType(new PokemonType(client, POKEMON_TYPE_ID))
    .registerCommand(new BsrAboutCommand(client))
    .registerCommand(new BsrCommand(client))
    .registerCommand(new BsrOfCommand(client))
    .registerCommand(new DexSearchCommand(client))
    .registerCommand(new TestServerCommand(client));

  await client.login(process.env.CAP_DISCORD_BOT_TOKEN);
};

init();
