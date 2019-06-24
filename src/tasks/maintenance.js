const Discord = require("discord.js");

module.exports = {
    name: 'maintenance',
    description: 'Lock down the server for maintenance.',
    guildOnly: true,
    cooldown: 25,
    aliases: ['lockdown'],
    args: true,
    usage: '"Reason"',
    execute(message, args) {
        let server = message.channel.guild;
        let lockdownChannel = server.channels.find(c => c.name.toString() === "maintenance" && c.type === "text");
        if(!lockdownChannel){
            /* Fallback maintenance message, in case it isn't set. **/
            let maintenanceMessage =
                'Default maintenance message.' +
                '\nETA: 30 minutes';
            if(args.length){
                maintenanceMessage = args;
            }
            let maintenanceEmbed = new Discord.RichEmbed()
                .setTimestamp()
                .setColor(0xfc5c50)
                .setTitle('Maintenance Mode')
                .setDescription("The server is now in maintenance mode. You\'ll be able to access your channels soon."
                    + "\n\nReason: "
                    + maintenanceMessage)
                .setFooter(message.author.username);

            server.createChannel('maintenance', 'text',[
                {
                    id: server.defaultRole.id,
                    allow: ['VIEW_CHANNEL'],
                    deny: ['SEND_MESSAGES'],
                }
            ]).then(channel => {
                channel.send(maintenanceEmbed);
                channel.overwritePermissions(server.defaultRole.id, { VIEW_CHANNEL: true });
                channel.overwritePermissions(server.defaultRole.id, { SEND_MESSAGES: false });
            });
            let channels = message.guild.channels;
            channels.forEach(c => {
                if(c.permissionOverwrites){

                }else{
                    c.overwritePermissions(server.defaultRole.id, { SEND_MESSAGES: false, READ_MESSAGES: false, VIEW_CHANNEL: false });
                }
            })
        }else{
            message.reply("Turning off maintenance mode.");
            lockdownChannel.delete("Maintenance mode is no longer enabled.");
            let channels = message.guild.channels;
            channels.forEach(c => {
                if(c.permissionOverwrites){
                    c.permissionOverwrites.get(server.defaultRole.id).delete();
                }
            })
        }
    }
};