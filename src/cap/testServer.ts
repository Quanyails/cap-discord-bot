import { MessageEmbed } from "discord.js";
import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";

import { CAP_GROUP_ID } from "./capGroup";

class TestServerCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      args: [],
      aliases: ["server"],
      description: "Gets the location of the CAP test server.",
      group: CAP_GROUP_ID,
      memberName: "test-server",
      name: "test-server",
    });
  }

  // eslint-disable-next-line class-methods-use-this
  run = async (message: CommandoMessage) => {
    return message.embed(
      new MessageEmbed()
        .setTitle("CAP Test Server")
        .setURL("http://captest.psim.us/")
    );
  };
}

export default TestServerCommand;
