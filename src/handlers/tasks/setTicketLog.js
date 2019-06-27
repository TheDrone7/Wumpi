const guildSettings = require('../../lib/mongodb');

module.exports = {
    name: 'setticketlog',
    description: 'Change the servers set ticket log.',
    guildOnly: true,
    permissionsRequired: ['ADMINISTRATOR'],
    cooldown: 60,
    args: true,
    aliases: ['ticketlog', 'ticket-log', 'set ticketlog', 'set ticket log'],
    usage: '[command name] "Category ID"',
    async execute(message, args) {
        const currentGuildID = message.guild.id;
        const newChannel = args[0];
        guildSettings.findOne({
            guildID: currentGuildID
        }, (err, g) => {
            if (err) {
                console.error(err);
            }
            message.guild.channels.forEach(c => {
                if (c.name === newChannel) {
                    g.ticketLogChannelID = newChannel.id;
                    return g.save();
                }
                if (c.id === newChannel) {
                    g.ticketLogChannelID = newChannel;
                    return g.save();
                }
            });
        });
        message.reply('I\'ve set the ticket log to `' + newChannel + '`');
    }
};