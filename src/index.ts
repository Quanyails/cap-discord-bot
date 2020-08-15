import { Intents } from "discord.js";
import { CommandoClient } from "discord.js-commando";

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

  await client.login(process.env.CAP_DISCORD_BOT_TOKEN);
};

init();
