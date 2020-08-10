## From empty directory to "Hello, World!"

1. Set up `.gitignore`:
   - Copy from [here](https://github.com/github/gitignore/blob/master/Node.gitignore).
1. Install `nodenv`:
   ```shell script
   brew install nodenv
   nodenv install 14.4.0
   nodenv local 14.4.0
   ```
1. Set up `package.json`:
   ```shell script
   npm init
   ```
1. Set up types:
   ```shell script
   npm install --save-dev @types/node
   ```
1. Set up and configure TypeScript:
   ```
   npm install --save-dev typescript
   npx tsc --init
   ```
   - Required TS config settings:
   ```json
   {
     "compilerOptions": {
       "module": "ESNext"
     },
     "rules": {
       "no-unused-vars": "off",
       "@typescript-eslint/no-unused-vars": "error"
     }
   }
   ```
   - [All config options](https://www.typescriptlang.org/tsconfig)
   - [Helpful setup guide](https://khalilstemmler.com/blogs/typescript/node-starter-project/)
   - `@typescript-eslint/no-unused-vars` fixes `no-unused-vars` firing on TS types.
     ([Link](https://stackoverflow.com/questions/55280555/))
1. Set up and configure [ESLint](https://eslint.org/):

   ```shell script
   npm install --save-dev eslint
   npx eslint --init
   ```

   (Using Airbnb + TypeScript)

   In `.eslintrc`:

   ```json
   {
     "import/extensions": [
       "error",
       "ignorePackages",
       {
         "js": "never",
         "jsx": "never",
         "ts": "never",
         "tsx": "never"
       }
     ]
   }
   ```

1. Set up and configure [eslint-import-resolver-typescript](https://github.com/alexgorbatchev/eslint-import-resolver-typescript):
   ```shell script
   npm install --save-dev eslint-import-resolver-typescript
   ```
   in `.eslintrc`:
   ```json
   {
     "settings": {
       "import/resolver": {
         "typescript": {}
       }
     }
   }
   ```
1. Set up [Prettier](https://prettier.io/):
   ```shell script
   npm install --save-dev prettier
   ```
1. Set up [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier):
   ```shell script
   npm install --save-dev eslint-config-prettier
   ```
   - Extend `.eslintrc` with `eslint-config-prettier`.
1. Set up [lint-staged](https://github.com/okonet/lint-staged):
   ```shell script
   npx mrm lint-staged
   ```
1. Create an `index.ts` file:
   ```shell script
   touch index.ts
   echo 'console.log("Hello, World!")' >> index.ts
   npx tsc
   node index.js
   ```

## Debugging in WebStorm

1. Install the JetBrains plugin for [Node.js](https://plugins.jetbrains.com/plugin/6098-node-js).
1. Ensure you are on Node >= 13 for ES6 module support ([StackOverflow](https://stackoverflow.com/questions/45854169/)).
1. Enable `"sourceMap": true` in `tsconfig.json`.
1. Set up a Run/Debug Configuration for Node.js.
   - In the "Before launch" section, add the action "Compile TypeScript".

## From "Hello, World!" to bot enabled

1. If you're using ES6 modules (experimental) instead of CommonJS modules (default):
   - Add `"type": "module"` to `package.json`.
   - Rename `.eslintrc.js` to `.eslintrc.cjs`.
1. Follow [this guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html).
   ```shell script
   npm install --save discord.js
   ```
1. Install the Discord bot framework of your choice.
   - [This article comparing frameworks](https://github.com/1Computer1/discord.js-frameworks-comparison) seems useful?
   ```shell script
   npm install --save discordjs/Commando
   ```
1. [Create a bot user + token](https://discordjs.guide/preparations/setting-up-a-bot-application.html#your-token) and save it to the `CAP_DISCORD_BOT_TOKEN` environmental variable.
1. Run `npm start`.
