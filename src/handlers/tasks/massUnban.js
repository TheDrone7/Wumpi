const guildSettings = require('../../lib/guilddb');
const {client} = require('../../wumpi.js');

module.exports = {
    name: 'massUnban',
    description: 'Unban all players',
    guildOnly: true,
    permissionsRequired: ['ADMINISTRATOR'],
    cooldown: 60,
    args: true,
    aliases: ['unban all', 'unbanall', 'mass unban'],
    usage: '[command name]',
    async execute(message, args) {
        let guild = message.guild;
        let bans = guild.fetchBans();
    }
};