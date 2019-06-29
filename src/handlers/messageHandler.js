const {cleverbot_key} = require('../config.json');
const {client} = require('../wumpi.js');
const Cleverbot = require('cleverbot-node');
const cleverbot = new Cleverbot;
cleverbot.configure({botapi: cleverbot_key});
const guildSettings = require('../lib/guilddb');
const botUsers = require('../lib/botUsers');

client.on('message', async message => {
    if (message.channel.type === "dm") {
        botUsers.findOne({
            userID: message.author.id
        }, (err, user) => {
            if (err) {
                console.error(err);
            }
            if (user) {
                if (!user.checked) {
                    if (message.content.toString() === user.code) {
                        user.checked = true;
                        message.reply('Your account has been verified!\nYou can now chat with your friends on the server.');
                        user.save();
                    } else {
                        message.reply('Invalid ID.');
                    }
                } else {
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
                if (message.author.bot) return;
                cleverbot.write(message.content, (response) => {
                    message.channel.startTyping();
                    setTimeout(() => {
                        message.channel.send(response.output).catch(console.error);
                        message.channel.stopTyping();
                    }, Math.random() * (1 - 3) + 1 * 1000);
                });
            }
        });
    } else {
        let currentGuildID = message.channel.guild.id;
        if (currentGuildID !== null) {
            guildSettings.findOne({
                id: currentGuildID
            }, (err, g) => {
                if (err) console.error(err);
                if (!message.content.startsWith(g.variables.prefix) || message.author.bot) {
                    // MESSAGE HANDLING
                    let botCheck = message.channels.forEach(c => c.name === 'botCheck');
                    if (!botCheck) {
                        message.guild.createChannel('botCheck').then(c => {

                        }).catch()
                    }
                    if (message.author.bot) {
                        if (g.channels.userOnlyChannelIDs !== null) {
                            g.channels.userOnlyChannelIDs.forEach(c => {
                                if (c === message.channel.id)
                                    message.delete(250);
                            });
                        }
                    } else if (!message.author.bot) {
                        if (g.channels.botOnlyChannelIDs !== null) {
                            g.channels.botOnlyChannelIDs.forEach(c => {
                                if (c === message.channel.id)
                                    message.delete(250);
                            });
                        }
                    } else if (!message.attachments.size) {
                        if (g.channels.imageOnlyChannelIDs !== null) {
                            g.channels.imageOnlyChannelIDs.forEach(c => {
                                if (c === message.channel.id)
                                    message.delete(250);
                            });
                        }
                    }
                }
            });
        }
    }
});