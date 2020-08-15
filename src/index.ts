import { CommandoClient } from "discord.js-commando";

import { PREFIX } from "./prefix";

const init = async () => {
  const client = new CommandoClient({
    commandPrefix: PREFIX,
    owner: "259082173271769109",
  });

  await client.login(process.env.CAP_DISCORD_BOT_TOKEN);
};

init();
