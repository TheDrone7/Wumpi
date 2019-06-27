const guildOverwrites = require('../lib/guildOverwrites');

exports.maintenanceStart = function (message, maintenanceEmbed) {
    const guild = message.channel.guild;
    guild.createChannel('maintenance', 'text', [{
        id: guild.defaultRole.id,
        allow: ['VIEW_CHANNEL'],
        deny: ['SEND_MESSAGES'],
    }]).then(channel => {
        channel.send(maintenanceEmbed).catch();
        channel.overwritePermissions(guild.defaultRole.id, {VIEW_CHANNEL: true, SEND_MESSAGES: false}).catch();
    });
    let channels = guild.channels;
    channels.forEach(c => {
        if (c.permissionOverwrites.get(guild.defaultRole.id)) {
            c.overwritePermissions(guild.defaultRole.id, {
                SEND_MESSAGES: false,
                READ_MESSAGES: false,
                VIEW_CHANNEL: false
            }).catch();
        } else {
            c.overwritePermissions(guild.defaultRole.id, {
                SEND_MESSAGES: false,
                READ_MESSAGES: false,
                VIEW_CHANNEL: false
            }).catch();
        }
    });
};

exports.maintenanceStop = function (message, lockdownChannel) {
    message.reply("Turning off maintenance mode.");
    lockdownChannel.delete("Maintenance mode is no longer enabled.").catch();
    const guild = message.channel.guild;
    let channels = guild.channels;
    channels.forEach(c => {
        c.permissionOverwrites.get(guild.defaultRole.id).delete().catch();
        guildOverwrites.findOne({
            id: guild.id
        }, (err, g) => {
            if (err) {
                console.error(err);
            }
            g.channels.overwrites.keys().forEach(gc => {
                if (gc === c.id) {
                    c.permissionOverwrites.set(guild.defaultRole.id, gc.value);
                }
            });
        });
    });
};

exports.maintenanceSaveOverwrites = function (message) {
    let guild = message.channel.guild;
    let channels = guild.channels;
    channels.forEach(c => {
        if (c.permissionOverwrites.get(guild.defaultRole.id)) {
            guildOverwrites.findOne({
                id: guild.id
            }, (err, g) => {
                if (err) {
                    console.error(err);
                }
                g.channels.overwrites.addToSet([c.id, c.permissionOverwrites.get(guild.defaultRole.id)]);
                g.save()
            });
        }
    });
};