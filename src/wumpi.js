const Discord = require('discord.js');

const {bot_token} = require('./config.json');
const guildSchema = require('./lib/guilddb');
const ws = require('./ws.js');
const client = new Discord.Client({
    disableEveryone: true
});

require("./lib/functions")(client);

const WS = new ws(client);
//module.exports = client;

client.on("ready", () => console.log(`Ready as ${client.user.username}`))

/* Bot authorization **/
// noinspection JSIgnoredPromiseFromCall
client.login(bot_token)
.then(() => console.log(client.user.username))
.catch(console.error)

module.exports = client;