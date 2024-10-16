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
    prefix: 'o.', /* Optional. Default prefix is . */
    safemode: true, /* Optional. Default is false */
    encoding: "UTF-8", /* Shift-JIS is recommended for Japanese environment */
    useableUserId: ["957885295251034112"] /* Users who can use the bot */
  });

  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on('messageCreate', (message) => jsk.onMessageCreated(message));

client.login(token);
