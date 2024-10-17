const { Client } = require('discord.js-infer');
const { selfToken } = require('./config');
const { Jishaku } = require('@djsk/v13');

// Create a new client instance
const client = new Client();

// discord.jsk object
let jsk = {};

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.on('ready', (readyClient) => {
  // init discord.jsk
  jsk = new Jishaku(client, {
    prefix: 'o.', /* Optional. Default prefix is . */
    consoleLog: true, /* Optional. Output to log. Default is true */
    encoding: "UTF-8", /* Shift-JIS is recommended for Japanese environment */
    useableUserId: ["957885295251034112"] /* Users who can use the bot */
  });

  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on('messageCreate', (message) => jsk.onMessageCreated(message));

client.login(selfToken);
