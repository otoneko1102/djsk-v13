# @djsk/v13
Jishaku for discord.js v13<br>
The original jishaku (discord.py) is [here](https://github.com/Gorialis/jishaku).

## Usage
### Example
All example are [here](https://github.com/otoneko1102/djsk-v13/tree/main/examples).
```js
const { Client } = require('discord.js');
const { token, intents } = require('./config');
const { Jishaku } = require('@djsk/v13');

// Create a new client instance
// Important! Message Content Intent must be enabled to use djsk.
const client = new Client({ intents });

// discord.jsk object
let jsk = {};

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.on('ready', (readyClient) => {
  // init discord.jsk
  jsk = new Jishaku(client, {
    prefix: '.', /* Optional. Default prefix is . */
    safemode: true, /* Optional. Protect tokens and files. Default is false */
    consoleLog: true, /* Optional. Output to log. Default is true */
    encoding: "UTF-8", /* Shift-JIS is recommended for Japanese environment */
    useableUserId: ["957885295251034112"] /* Users who can use the bot */
  });

  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on('messageCreate', (message) => jsk.onMessageCreated(message));

client.login(token);
```
#### Warning: safemode is not always safe!
Note: You can use this package for selfbot.<br>
Replace Discord.js with one of the following and require!
- [discord.js-selfbot-v13](https://www.npmjs.com/package/discord.js-selfbot-v13)
- [discord.js-infer](https://www.npmjs.com/package/discord.js-infer)
#### I don't take any responsibility for blocked Discord accounts that used this module.
#### Using this on a user account is prohibited by the [Discord TOS](https://discord.com/terms) and can lead to the account block.

### Commands
- <strong>.jsk sh {commands}</strong>
> Evaluate Terminal commands.
- <strong>.jsk js {commands}</strong>
> Evaluate JavaScript commands.
- <strong>.jsk shutdown</strong>
> Shutdown.

## Get Support
<a href="https://discord.gg/yKW8wWKCnS"><img src="https://discordapp.com/api/guilds/1005287561582878800/widget.png?style=banner4" alt="Discord Banner"/></a>
