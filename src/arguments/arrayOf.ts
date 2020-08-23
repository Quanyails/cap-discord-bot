import {
  Argument,
  ArgumentType,
  CommandoClient,
  CommandoMessage,
} from "discord.js-commando";
import memoizeOne from "memoize-one";

const memoizeArray = memoizeOne(
  <T>(
    argumentType: ArgumentType,
    ...args: Parameters<ArgumentType["parse"]>
  ): T[] => {
    const tokens = args[0].split(" ").map((token) => token.trim());
    const result: T[] = tokens.map((token) =>
      argumentType.parse(token, args[1], args[2])
    );
    return result;
  }
);

const arrayTypeOf = <T>(ItemType: typeof ArgumentType): typeof ArgumentType => {
  const id = `${Date.now()}`; // preferably this should be a hash
  const fakeClient = new CommandoClient({
    commandPrefix: id,
  });
  const argumentType = new ItemType(fakeClient, id);

  return class extends ArgumentType {
    parse = (s: string, msg: CommandoMessage, args: Argument): T[] => {
      return memoizeArray<T>(argumentType, s, msg, args);
    };

    validate = (s: string, msg: CommandoMessage, args: Argument) => {
      try {
        memoizeArray<T>(argumentType, s, msg, args);
        return true;
      } catch (e) {
        return e.message;
      }
    };
  };
};

export default arrayTypeOf;
