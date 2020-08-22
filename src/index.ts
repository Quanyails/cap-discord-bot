import { Intents } from "discord.js";
import { CommandGroup, CommandoClient } from "discord.js-commando";

import { CAP_GROUP_ID } from "./cap/capGroup";
import { PREFIX } from "./prefix";

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
    .registerGroup(new CommandGroup(client, CAP_GROUP_ID, "CAP"));

  await client.login(process.env.CAP_DISCORD_BOT_TOKEN);
};

init();
