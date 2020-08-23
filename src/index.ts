import { CommandGroup, CommandoClient } from "discord.js-commando";

import FormatType, { FORMAT_TYPE_ID } from "./arguments/format";
import PokemonType, { POKEMON_TYPE_ID } from "./arguments/pokemon";
import PokemonArrayType, {
  POKEMON_ARRAY_TYPE_ID,
} from "./arguments/pokemonArray";
import TierType, { TIER_TYPE_ID } from "./arguments/tier";
import TypeType, { TYPE_TYPE_ID } from "./arguments/type";
import BsrCommand from "./bsr/bsr";
import BsrAboutCommand from "./bsr/bsrAbout";
import { BSR_GROUP_ID } from "./bsr/bsrGroup";
import BsrOfCommand from "./bsr/bsrOf";
import FormatBsrOfCommand from "./bsr/formatBsrOf";
import TierBsrOfCommand from "./bsr/tierBsrOf";
import { CAP_GROUP_ID } from "./cap/capGroup";
import TestServerCommand from "./cap/testServer";
import { PREFIX } from "./prefix";
import DexSearchCommand from "./ps/dexSearch";
import { PS_GROUP_ID } from "./ps/psGroup";

const init = async () => {
  const client = new CommandoClient({
    commandPrefix: PREFIX,
    owner: "259082173271769109",
  });
  client.registry
    .registerDefaults()
    .registerGroup(new CommandGroup(client, BSR_GROUP_ID, "BSR"))
    .registerGroup(new CommandGroup(client, CAP_GROUP_ID, "CAP"))
    .registerGroup(new CommandGroup(client, PS_GROUP_ID, "PS"))
    .registerType(new FormatType(client, FORMAT_TYPE_ID))
    .registerType(new PokemonArrayType(client, POKEMON_ARRAY_TYPE_ID))
    .registerType(new PokemonType(client, POKEMON_TYPE_ID))
    .registerType(new TierType(client, TIER_TYPE_ID))
    .registerType(new TypeType(client, TYPE_TYPE_ID))
    .registerCommand(new BsrAboutCommand(client))
    .registerCommand(new BsrCommand(client))
    .registerCommand(new BsrOfCommand(client))
    .registerCommand(new DexSearchCommand(client))
    .registerCommand(new FormatBsrOfCommand(client))
    .registerCommand(new TestServerCommand(client))
    .registerCommand(new TierBsrOfCommand(client));

  await client.login(process.env.CAP_DISCORD_BOT_TOKEN);
};

init();
