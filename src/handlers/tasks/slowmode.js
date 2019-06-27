module.exports = {
    name: 'slowmode',
    description: 'Turns on slowmode.',
    guildOnly: true,
    cooldown: 60,
    permissionsRequired: ['ADMINISTRATOR'],
    aliases: ['channel slowmode', 'set channel slowmode'],
    args: false,
    usage: '[command name] "Time',
    /**
     * @param message
     * @param args
     */
    execute(message, args) {
        message.channel.setRateLimitPerUser(args[0], 'Automatic').catch();
        message.reply('Set rate limit for channel to ' + args[0]);
    }
};