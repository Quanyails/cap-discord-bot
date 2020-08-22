import { CommandGroup, CommandoClient } from "discord.js-commando";

import { CAP_GROUP_ID } from "./cap/capGroup";
import { PREFIX } from "./prefix";

const init = async () => {
  const client = new CommandoClient({
    commandPrefix: PREFIX,
    owner: "259082173271769109",
  });
  client.registry
    .registerDefaults()
    .registerGroup(new CommandGroup(client, CAP_GROUP_ID, "CAP"));

  await client.login(process.env.CAP_DISCORD_BOT_TOKEN);
};

init();
