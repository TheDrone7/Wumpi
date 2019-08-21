const Discord = require("discord.js");
const { maintenanceStart } = require('../maintenanceHandler.js');

module.exports = {
    name: 'maintenance',
    description: 'Lock down the server for maintenance.',
    guildOnly: true,
    permissionsRequired: ['ADMINISTRATOR'],
    cooldown: 15,
    aliases: ['lockdown'],
    usage: '[command name] "time" "Reason"',
    args: true,
    /**
     * 
     * @param client {Discord.Client}
     * @param message {Discord.Message}
     * @param args {String[]}
     */
    execute(client, message, args) {

        if(args.length <= 2)
            return message.channel.send("You need to enter a time and a reason!");
        const time = args[0];
        if(!time.includes('s') && !time.includes('m') && !time.includes('h'))
            return message.channel.send("You entered a wrong time!");
        const reason = args.filter((arg, index) => index !== 0).map((arg, index) => arg).join(' ');
        if(!reason)
            return message.channel.send("No reason entered");

        let maintenanceMessage = `Maintenance mode is enabled because: '${reason}'.\nETA: ${time}`;

        if(message.guild.channels.find(chan => chan.name === "maintenance" && chan.type === "text"))
            return message.channel.send("Maintenance is already enabled!");
        
        let maintenanceEmbed = new Discord.RichEmbed()
            .setTimestamp(new Date())
            .setColor("0xfc5c50")
            .setTitle('Maintenance Mode')
            .setDescription("The server is now in maintenance mode. You\'ll be able to access your channels soon.\n\nReason: " + maintenanceMessage)
            .setFooter(message.author.username);

        maintenanceStart(message, maintenanceEmbed, time);
    }
};