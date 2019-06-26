const Discord = require('discord.js');
const {prefix, mongoDB, token} = require('./config.json');
const client = new Discord.Client();
const guildSettings = require('./mongodb');
const mongoose = require("mongoose");
const commandHandler = require('./commandHandler');
const messageHandler = require('./messageHandler');
const reactionHandler = require('./reactionHandler');
mongoose.connect(mongoDB, {useNewUrlParser: true}, (err) => {
    if (err) return console.error(err);
    console.log('Connected to MongoDB.');
});

client.on('ready', async () => {
    await client.guilds.keyArray().forEach(id => {
        guildSettings.findOne({
            guildID: id
        }, (err, guild) => {
            if (err) console.error(err);
            if (!guild) {
                const newGuildSettings = new guildSettings({
                    guildID: id,
                    prefix: prefix,
                    supportRoleID: 'undefined',
                    maintenanceCategoryID: 'undefined',
                    ticketCategoryID: 'undefined',
                    imageOnlyChannelIDs: [],
                    botOnlyChannelIDs: [],
                    userOnlyChannelIDs: []
                });
                return newGuildSettings.save();
            }
        });
    });
    console.log('The bot is ready!');
    client.user.setActivity(client.guilds.size + ' Servers | ' + prefix + 'help', {type: 'LISTENING'});
});

client.on('message', async message => {
    if (message.channel.type === "dm") {
        messageHandler.messageHandler(message);
    } else {
        let currentGuildID = message.channel.guild.id;
        guildSettings.findOne({
            guildID: currentGuildID
        }, (err, guild) => {
            if (err) console.error(err);
            if (!message.content.startsWith(guild.prefix) || message.author.bot) {
                messageHandler.messageHandler(message);
            } else {
                commandHandler.commandHandler(message, guild.prefix);
            }
        });
    }
});

client.on('messageReactionAdd', (reaction, user) => {
    reactionHandler.reactionAdd(reaction, user);
});

client.on('messageReactionRemove', (reaction, user) => {
    reactionHandler.reactionRemove(reaction, user);
});

/* Bot authorization **/
// noinspection JSIgnoredPromiseFromCall
client.login(token);