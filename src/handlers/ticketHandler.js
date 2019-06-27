/**
 * Creates a new channel for the user mentioned/that ran the command
 *
 * @param message
 * @param guild
 * @param ticketUser
 * @param maxTickets {Number}
 * @param supportRoleID
 * @param ticketCategoryID
 * @param ticketEmbed
 *
 * @returns new channel
 */
exports.ticket = function (message, guild, ticketUser, maxTickets, supportRoleID, ticketCategoryID, ticketEmbed) {
    let count = 0;
    guild.channels.forEach(c => {
        if (c.name.includes(ticketUser.username)) {
            count = count + 1;
            if (count === maxTickets)
                return message.channel.send(ticketUser + ', has too many tickets already!')
        }
    });

    guild.createChannel('Support - ' + ticketUser.username, 'text', [{
        id: ticketUser.id,
        allow: ['READ_MESSAGES', 'SEND_MESSAGES', 'VIEW_CHANNEL', 'ATTACH_FILES'],
    }, {
        id: supportRoleID,
        allow: ['READ_MESSAGES', 'SEND_MESSAGES', 'VIEW_CHANNEL', 'ATTACH_FILES'],
    }, {
        id: guild.defaultRole.id,
        deny: ['READ_MESSAGES', 'SEND_MESSAGES', 'VIEW_CHANNEL', 'ATTACH_FILES'],
    }]).then(channel => {
        message.reply(`support ticket created ${channel}`);
        let category = guild.channels.find(c => c.id === ticketCategoryID && c.type === "category");
        if (category) {
            channel.setParent(ticketCategoryID).catch(console.error);
        }
        channel.send(ticketEmbed).catch(console.error);
    }).catch(console.error);
};

exports.close = function (guild, channel, reasonEmbed, ticketLogID) {
    if (ticketLogID) {
        guild.channels.forEach(c => {
            if (c.id === ticketLogID)
                c.send(reasonEmbed);
        });
    }
    channel.delete()
};