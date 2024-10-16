# @djsk/v13

## Usage
### Example
```js
const { Client } = require('discord.js');
const { token, intents } = require('./config');
const { djsk } = require('@djsk/v13');

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
  jsk = new djsk(client, {
    prefix: 'o.', /* Optional. Default prefix is . */
    safemode: true, /* Optional. Default is false */
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
