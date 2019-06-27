const {cleverbot_key} = require('../config.json');
const {client, default_prefix} = require('../wumpi.js');
const Cleverbot = require('cleverbot-node');
const cleverbot = new Cleverbot;
cleverbot.configure({botapi: cleverbot_key});
const guildSettings = require('../lib/mongodb');

client.on('message', async message => {
    if (message.channel.type === "dm") {
        if (!message.content.startsWith(default_prefix) || message.author.bot) {
            if (message.author.bot) return;
            cleverbot.write(message.content, (response) => {
                message.channel.startTyping();
                setTimeout(() => {
                    message.channel.send(response.output).catch(console.error);
                    message.channel.stopTyping();
                }, Math.random() * (1 - 3) + 1 * 1000);
            });
        }
    } else {
        let currentGuildID = message.channel.guild.id;
        guildSettings.findOne({
            guildID: currentGuildID
        }, (err, guild) => {
            if (err) console.error(err);
            if (!message.content.startsWith(guild.prefix) || message.author.bot) {
                // MESSAGE HANDLING
            }
        });
    }
});