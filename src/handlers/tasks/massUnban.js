module.exports = {
    name: 'massunban',
    description: 'Unban all players',
    guildOnly: true,
    permissionsRequired: ['ADMINISTRATOR'],
    cooldown: 60,
    aliases: ['unban all', 'unbanall', 'mass unban'],
    usage: '[command name]',
    async execute(client, message, args) {
        let guild = message.guild;
        guild.fetchBans().then(bans => {
            bans.array().forEach(b => {
                guild.unban(b).catch();
                console.log('Unbanned: ' + b.username);
                message.reply('Unbanned all users!')
            })
        })
    }
};