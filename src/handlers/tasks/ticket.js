const Discord = require("discord.js");
const guildSettings = require('../../lib/guilddb');
const ticketHandler = require('../ticketHandler.js');
module.exports = {
    name: 'ticket',
    description: 'Displays some about information.',
    cooldown: 30,
    aliases: ['new', 'support'],
    permissionsRequired: ['READ_MESSAGES'],
    usage: '[command name] "User" "Topic"',
    /**
     * 
     * @param client {Discord.Client}
     * @param message {Discord.Message}
     * @param args {String[]}
     */
    execute(client, message, args) {
        let guild = message.channel.guild;
        let topic = args.slice(0).join(" ");
        let currentGuild = message.channel.guild;
        let currentGuildID = currentGuild.id;
        guildSettings.findOne({
            id: currentGuildID
        }, (err, g) => {
            if (err) return console.error(err);
            let supportRoleID = g.variables.supportRoleID;
            let ticketCategoryID = g.channels.ticketCategoryID;
            let greetingMessage = g.variables.ticketGreetingMessage;
            let ticketUser;
            if(message.channel.type === "dm") return;
            const supportRole = message.guild.roles.find(role => role.id === supportRoleID);
            if(!supportRoleID)
                return message.channel.send("Set a valid support role first!");
            if (message.member.roles.has(supportRole.id))
                ticketUser = message.mentions.members.first();
            if (!ticketUser)
                ticketUser = message.member;
            let ticketEmbed = new Discord.RichEmbed()
                .setTitle('Support Ticket')
                .setTimestamp(new Date())
                .setColor("0x02fc62")
                .setThumbnail(client.user.displayAvatarURL)
                .setDescription(
                    'Hello '
                    + ticketUser
                    + ', \n'
                    + greetingMessage
                    + '\n\n'
                    + '**Topic**: ' + topic
                    + '\n\n'
                    + 'You can close the ticket any time with -close');
            if (supportRoleID && ticketCategoryID) {
                console.log('all set - roles');
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
                    guildSettings.findOneAndUpdate({id: message.guild.id}, g, (err, doc, res) => {
                        if(err) return console.log(err);
                    });
                }).catch(e => console.log(e));
            }
        });
    },
};