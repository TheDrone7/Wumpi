const guildSettings = require('../../lib/guilddb');

module.exports = {
    name: 'setprefix',
    description: 'Change the servers set prefix.',
    guildOnly: true,
    permissionsRequired: ['ADMINISTRATOR'],
    cooldown: 60,
    args: true,
    aliases: ['prefix'],
    usage: '[command name] "Prefix"',
    async execute(message, args) {
        const currentGuildID = message.guild.id;
        const newPrefix = args[0];
        if (1 < newPrefix.size < 5) {
            guildSettings.findOne({
                id: currentGuildID
            }, (err, guild) => {
                if (err) {
                    console.error(err);
                }
                guild.variables.prefix = newPrefix;
                return guild.save();
            });
            message.reply('I\'ve set the guild prefix to `' + newPrefix + '`');
        } else {
            message.reply('Your prefix `' + newPrefix + '` was too long!')
        }
    }
};