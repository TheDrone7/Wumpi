const Discord = require("discord.js");
const prefix = require('../config.json');
const fs = require('fs');

module.exports = {
    name: 'maintenance',
    description: 'Lock down the server for maintenance.',
    guildOnly: true,
    permissionsRequired: ['ADMINISTRATOR'],
    cooldown: 25,
    aliases: ['lockdown'],
    usage: '[command name] "Reason"',
    execute(message, args) {
        let channelPerms = new Map[{
            guild_id: server.id,
            channel_id: [],
            permissionsList: []
        }];
        let server = message.channel.guild;
        let lockdownChannel = server.channels.find(c => c.name.toString() === "maintenance" && c.type === "text");
        if (!lockdownChannel) {
            /* Fallback maintenance message, in case it isn't set. **/
            let maintenanceMessage =
                'Default maintenance message.' +
                '\nETA: 30 minutes';
            if (args.length) {
                maintenanceMessage = message.content.replace(prefix, '');
            }
            let maintenanceEmbed = new Discord.RichEmbed()
                .setTimestamp()
                .setColor(0xfc5c50)
                .setTitle('Maintenance Mode')
                .setDescription("The server is now in maintenance mode. You\'ll be able to access your channels soon."
                    + "\n\nReason: "
                    + maintenanceMessage)
                .setFooter(message.author.username);

            server.createChannel('maintenance', 'text', [
                {
                    id: server.defaultRole.id,
                    allow: ['VIEW_CHANNEL'],
                    deny: ['SEND_MESSAGES'],
                }
            ]).then(channel => {
                channel.send(maintenanceEmbed);
                channel.overwritePermissions(server.defaultRole.id, {VIEW_CHANNEL: true, SEND_MESSAGES: false});
            });

            let channels = message.guild.channels;
            channels.forEach(c => {
                if (c.permissionOverwrites.get(server.defaultRole.id)) {
                    let overwritesType = c.permissionOverwrites.get(server.defaultRole.id).type;
                    let overwritesValue = !!c.permissionOverwrites.get(server.defaultRole.id).allowed;
                    console.log("Added " + c.id + " to the hashmap with value " + overwritesType);
                    c.overwritePermissions(server.defaultRole.id, {
                        SEND_MESSAGES: false,
                        READ_MESSAGES: false,
                        VIEW_CHANNEL: false
                    });
                } else {
                    c.overwritePermissions(server.defaultRole.id, {
                        SEND_MESSAGES: false,
                        READ_MESSAGES: false,
                        VIEW_CHANNEL: false
                    });
                }
            });
        } else {
            message.reply("Turning off maintenance mode.");
            lockdownChannel.delete("Maintenance mode is no longer enabled.");
            let channels = message.guild.channels;
            let rawdata = fs.readFileSync('permissionData.json');
            let newOverrides = new Map(JSON.parse(rawdata));
            channels.forEach(c => {
                if (c.permissionOverwrites.get(server.defaultRole.id)) {
                    c.permissionOverwrites.get(server.defaultRole.id).delete();
                }
            });
            newOverrides.get(key).forEach(c => {
                c.overwritePermissions(server.defaultRole.id, {
                    newOverrides
                });
            });
        }
        fs.writeFile('permissionData.json', JSON.stringify(channelPerms), (err) => {
            if (err) throw err;
            console.log("Writing Data here");
        });
    }
};