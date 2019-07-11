const Discord = require("discord.js");
const maintenanceHandler = require('../maintenanceHandler.js');

module.exports = {
    name: 'maintenance',
    description: 'Lock down the server for maintenance.',
    guildOnly: true,
    permissionsRequired: ['ADMINISTRATOR'],
    cooldown: 25,
    aliases: ['lockdown'],
    usage: '[command name] "Reason"',
    execute(client, message, args) {
        let maintenanceMessage = 'Default maintenance message.\nETA: 30 minutes';
        if (args.length)
            maintenanceMessage = args.slice(0).join(" ");
        let maintenanceEmbed = new Discord.RichEmbed()
            .setTimestamp()
            .setColor(0xfc5c50)
            .setTitle('Maintenance Mode')
            .setDescription("The server is now in maintenance mode. You\'ll be able to access your channels soon."
                + "\n\nReason: "
                + maintenanceMessage)
            .setFooter(message.author.username);
        let lockdownChannel = message.channel.guild.channels.find(c => c.name.toString() === "maintenance" && c.type === "text");
        if (!lockdownChannel) {
            maintenanceHandler.maintenanceStart(message, maintenanceEmbed);
        } else {
            maintenanceHandler.maintenanceStop(message, lockdownChannel);
        }
    }
};