const {cleverbot_key} = require('../config.json');
const {client, default_prefix} = require('../wumpi.js');
const Cleverbot = require('cleverbot-node');
const cleverbot = new Cleverbot;
cleverbot.configure({botapi: cleverbot_key});
const guildSettings = require('../lib/guilddb');

client.on('message', async message => {
    if (message.channel.type === "dm") {
            if (message.author.bot) return;
            cleverbot.write(message.content, (response) => {
                message.channel.startTyping();
                setTimeout(() => {
                    message.channel.send(response.output).catch(console.error);
                    message.channel.stopTyping();
                }, Math.random() * (1 - 3) + 1 * 1000);
            });
    } else {
        let currentGuildID = message.channel.guild.id;
        if (currentGuildID !== null) {
            guildSettings.findOne({
                id: currentGuildID
            }, (err, guild) => {
                if (err) console.error(err);
                if (!message.content.startsWith(guild.variables.prefix) || message.author.bot) {
                    // MESSAGE HANDLING
                    guildSettings.findOne({
                        guildID: currentGuildID
                    }, (err, g) => {
                        if (err) {
                            console.error(err);
                        }
                        if (message.author.bot) {
                            if (g.channels.userOnlyChannelIDs.length !== 0) {
                                g.channels.userOnlyChannelIDs.forEach(c => {
                                    if (c === message.channel.id)
                                        message.delete(250);
                                });
                            }
                        } else if (!message.author.bot) {
                            if (g.channels.botOnlyChannelIDs.length !== 0) {
                                g.channels.botOnlyChannelIDs.forEach(c => {
                                    if (c === message.channel.id)
                                        message.delete(250);
                                });
                            }
                        } else if (!message.attachments.size) {
                            if (g.channels.imageOnlyChannelIDs.length !== 0) {
                                g.channels.imageOnlyChannelIDs.forEach(c => {
                                    if (c === message.channel.id)
                                        message.delete(250);
                                });
                            }
                        }
                    });
                }
            });
        }
    }
});