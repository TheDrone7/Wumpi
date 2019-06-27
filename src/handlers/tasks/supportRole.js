const guildSettings = require('../../lib/mongodb');

module.exports = {
    name: 'setsupportrole',
    description: 'Change the servers set ticket category.',
    guildOnly: true,
    permissionsRequired: ['ADMINISTRATOR'],
    cooldown: 60,
    args: true,
    aliases: ['set support', 'supportteam', 'set support role'],
    usage: '[command name] "Category ID"',
    async execute(message, args) {
        const currentGuildID = message.guild.id;
        const newRole = args[0];
        guildSettings.findOne({
            guildID: currentGuildID
        }, (err, g) => {
            if (err) {
                console.error(err);
            }
            message.guild.roles.forEach(r => {
                if (r.name === newRole) {
                    g.supportRoleID = newRole.id;
                    return g.save();
                }
                if (r.id === newRole) {
                    g.supportRoleID = newRole;
                    return g.save();
                }
            });
        });
        message.reply('I\'ve set the support role to `' + newRole + '`');
    }
};