const Discord = require('discord.js');
const {bot_token} = require('./config.json');
const client = new Discord.Client({
    disableEveryone: true
});

require("./lib/functions")(client);

module.exports.client = client;

/* Bot authorization **/
// noinspection JSIgnoredPromiseFromCall
client.login(bot_token);