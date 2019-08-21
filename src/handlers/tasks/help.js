const Discord = require("discord.js");
const guildSettings = require('../../lib/guilddb');
const ticketHandler = require('../ticketHandler.js');
//const {client} = require('../../wumpi.js');
module.exports = {
    name: 'help',
    description: 'List all of my commands or info about a specific command.',
    aliases: ['commands', 'cmds'],
    usage: '[command name]',
    cooldown: 10,
    /**
     * Help message, displays all commands
     *
     * @param message
     * @param args
     * @returns {*}
     */
    execute(client, message, args) {
      
        var helpEmbed = new Discord.RichEmbed()
            .setTitle('All commands of Wumpi')
            .setAuthor(message.author.username, message.author.avatarURL)
            .setTimestamp(new Date())
            .setColor("0x02fc62")
            .setThumbnail(client.user.displayAvatarURL)
            .setDescription("If you want to learn more about 'Wumpi', check out our [Discord](https://discord.gg/fbkygd 'Discord server') or head over to its [Github](https://github.com/alex5219/Wumpi 'Github') to understand it better!")
            .addField('Member management', 
            "__-avatar @User__\nSends you the avatar\n\n__-ban @User 'Reason'__\nBans the tagged user\n\n__-mute @User 'Reason'__\nMutes the tagged user\n\n__-kick @User 'Reason'__\nKicks the tagged user",
            true)
            .addField('Support',
            "__-new__\nCreates support ticket\n\n__-close__\nCloses a support ticket\n\n__-settopic 'topic'__\nSets a ticket topic\n\n__-setcategory 'Category'__\nSets category for support tickets",
            true)
            .addField("Guild settings", 
            "__-setprefix 'prefix'__\nSets the bot prefix for your guild\n\n__-setticketlog 'Channel'__\nSets the log channel for tickets\n\n__-supportrole 'Role'__\nSets support role for tickets\n\n__-backup__\nInitializes backup of your guild\n\n__-load 'key'__\nBackups up your entire guild",
            true)
            .addField("Guild management", 
            "__-clear 'count'__\nClears channel\n\n__-massunban__\nUnbans all users\n\n__-lockdown__\nLocks down the server for maintenance",
            true)
            .addField("Channel management", 
            "__-slowmode 'time'__\nTurns on/off slowmode\n\n__-imageonly__\nMakes channel image only\n\n__-textonly__\nMakes channel text only\n\n__-botonly__\nMakes channel bot only\n\n__-nsfw__\nTurns on/off NSFW",
            true)
            .addField("Extra", 
            "__-help__\nList of all commands\n\n__-about__\nSends an 'about me' page",
            true)
            .setFooter('-- @help message', client.user.avatarURL);

        message.author.send("loading...")
        .catch((e) => {
            if(e) return console.log(e);
        }).then(msg => {
            message.delete()
            .catch(e => console.log(e));
            msg.edit(helpEmbed).catch((e) => console.log(e));
        })
    }
};