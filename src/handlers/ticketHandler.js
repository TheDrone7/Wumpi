/**
 * Creates a new channel for the user mentioned/that ran the command
 *
 * @param message
 * @param guild
 * @param ticketUser
 * @param supportRoleID
 * @param ticketCategoryID
 * @param ticketEmbed
 *
 * @returns new channel
 */

const guildSettings = require('../lib/guilddb.js');

exports.ticket = function (message, guild, ticketUser, supportRoleID, ticketCategoryID, ticketEmbed) {
    guild.createChannel(`Support-${message.author.username}`, {
      type: "text",
      permissions: [{
        id: ticketUser.id,
        allow: ['READ_MESSAGES', 'SEND_MESSAGES', 'VIEW_CHANNEL', 'ATTACH_FILES'],
       }, {
        id: supportRoleID,
        allow: ['READ_MESSAGES', 'SEND_MESSAGES', 'VIEW_CHANNEL', 'ATTACH_FILES'],
       }, {
        id: guild.defaultRole.id,
        deny: ['READ_MESSAGES', 'SEND_MESSAGES', 'VIEW_CHANNEL', 'ATTACH_FILES'],
      }]}).then(channel => {
        message.reply(`support ticket created ${channel}`);
        let category = guild.channels.find(c => c.id === ticketCategoryID && c.type === "category");
        if (category) {
            channel.send(ticketEmbed).catch(console.error);
            channel.setParent(ticketCategoryID).catch(console.error);
            guildSettings.findOne({
                id: guild.id
            }, (err, g) => {
                if (g.channels.ticketLogChannelID) {
                    guild.channels.forEach(c => {
                        if (c.id === g.channels.ticketLogChannelID)
                            c.send(ticketEmbed).catch();
                    });
                }
            })
        } else {
            message.reply('No ticket category is set!');
        }
    }).catch(console.error);
};

exports.close = function (guild, channel, reasonEmbed, ticketLogID) {
    if (ticketLogID) {
        guild.channels.forEach(c => {
            if (c.id === ticketLogID)
                c.send(reasonEmbed).catch();
        });
    }
    channel.delete().catch()
};