const guildSettings = require('../../lib/guilddb');

module.exports = {
    name: 'setcategory',
    description: 'Change the servers set ticket category.',
    guildOnly: true,
    permissionsRequired: ['ADMINISTRATOR'],
    cooldown: 60,
    args: true,
    aliases: ['category', 'ticketcategory', 'set category', 'set ticketcategory'],
    usage: '[command name] "Category ID"',
    async execute(message, args) {
        const currentGuildID = message.guild.id;
        const newCategory = args[0];
        guildSettings.findOne({
            id: currentGuildID
        }, (err, g) => {
            if (err) {
                console.error(err);
            }
            message.guild.channels.forEach(c => {
                if (c.name === newCategory) {
                    g.channels.ticketCategoryID = newCategory.id;
                    return g.save();
                }
                if (c.id === newCategory) {
                    g.channels.ticketCategoryID = newCategory;
                    return g.save();
                }
            });
        });
        message.reply('I\'ve set the ticket category to `' + newCategory + '`');
    }
};