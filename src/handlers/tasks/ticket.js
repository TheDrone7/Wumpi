const Discord = require("discord.js");
const guildSettings = require('../../lib/mongodb');
const ticketHandler = require('../ticketHandler.js');
const {client} = require('../../wumpi.js');
module.exports = {
    name: 'ticket',
    description: 'Displays some about information.',
    cooldown: 30,
    aliases: ['new', 'support'],
    permissionsRequired: ['READ_MESSAGES'],
    usage: '[command name] "User" "Topic"',
    execute: function (message, args) {
        let guild = message.channel.guild;
        let topic = args.slice(0).join(" ");
        let currentGuild = message.channel.guild;
        let currentGuildID = currentGuild.id;
        guildSettings.findOne({
            guildID: currentGuildID
        }, (err, g) => {
            if (err) console.error(err);
            let supportRoleID = g.supportRoleID;
            let ticketCategoryID = g.ticketCategoryID;
            let greetingMessage = g.ticketGreetingMessage;
            let ticketUser;
            if (guild.member(message.author).roles.has(supportRoleID))
                ticketUser = message.mentions.users.first();
            if (!ticketUser)
                ticketUser = message.author;
            let ticketEmbed = new Discord.RichEmbed()
                .setTitle('Support Ticket')
                .setTimestamp()
                .setColor(0x02fc62)
                .setThumbnail(client.displayAvatarURL)
                .setDescription(
                    'Hello '
                    + ticketUser.tag
                    + ', \n'
                    + greetingMessage
                    + '\n\n'
                    + '**Topic**: ' + topic
                    + '\n\n'
                    + 'You can close the ticket any time with -close');
            if (supportRoleID && ticketCategoryID) {
                ticketHandler.ticket(message, guild, ticketUser, g.ticketMaxTicketCount, supportRoleID, ticketCategoryID, ticketEmbed)
            } else if (supportRoleID) {
                ticketHandler.ticket(message, guild, ticketUser, g.ticketMaxTicketCount, supportRoleID, null, ticketEmbed)
            } else {
                guild.createRole({
                    name: 'Support Team',
                    color: "GREEN"
                }).then(role => {
                    ticketHandler.ticket(message, guild, ticketUser, g.ticketMaxTicketCount, role.id, null, ticketEmbed);
                    g.supportRoleID = role.id;
                    g.save();
                }).catch();
            }
        });
    },
};