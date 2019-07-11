const Discord = require("discord.js");
const guildSettings = require('../../lib/guilddb');
const ticketHandler = require('../ticketHandler.js');
const {client} = require('../../wumpi.js');
module.exports = {
    name: 'ticket',
    description: 'Displays some about information.',
    cooldown: 30,
    aliases: ['new', 'support'],
    permissionsRequired: ['READ_MESSAGES'],
    usage: '[command name] "User" "Topic"',
    execute(client, message, args) {
        let guild = message.channel.guild;
        let topic = args.slice(0).join(" ");
        let currentGuild = message.channel.guild;
        let currentGuildID = currentGuild.id;
        guildSettings.findOne({
            id: currentGuildID
        }, (err, g) => {
            if (err) console.error(err);
            let supportRoleID = g.variables.supportRoleID;
            let ticketCategoryID = g.channels.ticketCategoryID;
            let greetingMessage = g.variables.ticketGreetingMessage;
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
                ticketHandler.ticket(message, guild, ticketUser, supportRoleID, ticketCategoryID, ticketEmbed)
            } else if (supportRoleID) {
                ticketHandler.ticket(message, guild, ticketUser, supportRoleID, null, ticketEmbed)
            } else {
                guild.createRole({
                    name: 'Support Team',
                    color: "GREEN"
                }).then(role => {
                    ticketHandler.ticket(message, guild, ticketUser, role.id, null, ticketEmbed);
                    g.variables.supportRoleID = role.id;
                    g.save();
                }).catch();
            }
        });
    },
};