import { CommandGroup, CommandoClient } from "discord.js-commando";

import PokemonType, { POKEMON_TYPE_ID } from "./arguments/pokemon";
import { CAP_GROUP_ID } from "./cap/capGroup";
import TestServerCommand from "./cap/testServer";
import { PREFIX } from "./prefix";

const init = async () => {
  const client = new CommandoClient({
    commandPrefix: PREFIX,
    owner: "259082173271769109",
  });
  client.registry
    .registerDefaults()
    .registerGroup(new CommandGroup(client, CAP_GROUP_ID, "CAP"))
    .registerType(new PokemonType(client, POKEMON_TYPE_ID))
    .registerCommand(new TestServerCommand(client));

  await client.login(process.env.CAP_DISCORD_BOT_TOKEN);
};

init();
