exports.maintenanceStart = function (message, maintenanceEmbed) {
    let channelID;
    const guild = message.channel.guild;
    guild.createChannel('maintenance', 'text', [{
        id: guild.defaultRole.id,
        allow: ['VIEW_CHANNEL'],
        deny: ['SEND_MESSAGES'],
    }]).then(channel => {
        channelID = channel.id;
        channel.send(maintenanceEmbed).catch();
        channel.overwritePermissions(guild.defaultRole.id, {VIEW_CHANNEL: true, SEND_MESSAGES: false}).catch();
    });
    guild.createRole({
        name: 'MAINTENANCE',
        color: 'RED'
    }).then(role => {
        let channels = guild.channels;
        channels.forEach(c => {
            if (!c.id === channelID) {
                c.overwritePermissions(role.id, {
                    SEND_MESSAGES: false,
                    READ_MESSAGES: false,
                    VIEW_CHANNEL: false
                }).catch();
            }
        });
        guild.members.forEach(m => {
            m.addRole(role).catch();
        })
    }).catch();
};

exports.maintenanceStop = function (message, lockdownChannel) {
    message.reply("Turning off maintenance mode.");
    lockdownChannel.delete("Maintenance mode is no longer enabled.").catch();
    let role = message.channel.guild.roles.find(r => r.name === 'MAINTENANCE');
    role.delete().catch();
};