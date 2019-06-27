const Discord = require("discord.js");
const guildSettings = require('../../lib/mongodb');
const ticketHandler = require('../ticketHandler.js');
module.exports = {
    name: 'close',
    description: 'Closes a support ticket',
    aliases: ['delete', 'remove'],
    permissionsRequired: ['READ_MESSAGES'],
    usage: '[command name] "Reason"',
    /**
     * Closes support ticket
     *
     * @param message
     * @param args
     */
    execute: function (message, args) {
        let guild = message.channel.guild;
        let reason = args.slice(0).join(" ");
        let currentGuild = message.channel.guild;
        let currentGuildID = currentGuild.id;
        guildSettings.findOne({
            guildID: currentGuildID
        }, (err, g) => {
            if (err) console.error(err);
            let ticketCategoryID = g.ticketCategoryID;
            let reasonEmbed = new Discord.RichEmbed()
                .setTitle('Ticket Closed')
                .setTimestamp()
                .setColor(0x02fc62)
                .setThumbnail(message.author.displayAvatarURL)
                .setDescription(
                    'Ticket ' + message.channel.name + ' was closed by user ' + message.author.username + '.'
                    + '\n\n'
                    + '**Reason**: ' + reason)
                .setFooter(message.author.username);
            if (ticketCategoryID === message.channel.parentID) {
                ticketHandler.close(guild, message.channel, reasonEmbed, g.ticketLogChannelID);
            } else {
                message.reply('You need to run this command in a ticket channel!');
            }
        });
    },
};