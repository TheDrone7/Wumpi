const guildSettings = require('../../lib/guilddb');

module.exports = {
    name: 'setprefix',
    description: 'Change the servers set prefix.',
    guildOnly: true,
    permissionsRequired: ['ADMINISTRATOR'],
    cooldown: 30,
    args: true,
    aliases: ['prefix'],
    usage: '[command name] "Prefix"',
    async execute(client, message, args) {
        const currentGuildID = message.guild.id;
        const newPrefix = args[0];
        if (1 <= newPrefix.length < 5) {
            guildSettings.findOne({
                id: currentGuildID
            }, (err, guild) => {
                if (err) return console.log(err);
                guild.variables.prefix = newPrefix;
                guildSettings.findOneAndUpdate({id: currentGuildID}, guild, (err, doc) => {
                    if(err) return console.log(err);
                })
            });
            message.channel.send('I have set the guild prefix to `' + newPrefix + '`');
        } else {
            message.channel.send('Your prefix `' + newPrefix + '` had too many/less characters!')
        }
    }
};