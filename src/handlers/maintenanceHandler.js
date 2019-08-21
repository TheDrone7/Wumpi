const Discord = require('discord.js');
const ms = require('ms');

/**
 * @param message {Discord.Message}
 * @param maintenanceEmbed {Discord.RichEmbed}
 * @param time {String}
 */
const maintenanceStart = (message, maintenanceEmbed, time) => {
    const guild = message.guild;
    guild.createChannel('maintenance', {
        type: "text",
        permissionOverwrites: [{
            type: "role",
            deny: ["SEND_MESSAGES", "ADD_REACTIONS"],
            id: guild.defaultRole.id
        }]
    }).then(channel => {
        channel.send(maintenanceEmbed).catch(console.error());
        channel.overwritePermissions(guild.defaultRole.id, {
            "SEND_MESSAGES": false,
            "ADD_REACTIONS": false
        })
        .catch(console.error());
    })
    .catch(console.error());

    guild.channels.forEach(channel => {
        channel.overwritePermissions(guild.defaultRole, {
            "ADD_REACTIONS": false,
            "SEND_MESSAGES": false
        })
        .catch(console.error)
    });

    setTimeout(() => {
        const lockdownChannel = guild.channels.find(channel => channel.name === "maintenance" && channel.type === "text");
        if(!lockdownChannel)
            return;

        lockdownChannel.send("Maintenance mode is over, you can use your channels again!.")
        .then((msg) => {
            setTimeout(() => {
                lockdownChannel.delete().catch(console.error());
            }, ms("10s"));
        })

        guild.channels.forEach(channel => {
            channel.overwritePermissions(guild.defaultRole.id, {
                "SEND_MESSAGES": null,
                "ADD_REACTIONS": null
            })
        });

    }, ms(time));
}

module.exports = { maintenanceStart };