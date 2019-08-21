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
        guild.fetchBans()
        .then(bans => {
            bans.forEach(b => {
                guild.unban(b.user).catch(e => console.log(e));
                console.log('Unbanned: ' + b.user.username);
            });
            message.channel.send('Unbanned all users!').catch(e => console.log(e));
        }).catch(e => console.log(e));
    }
};