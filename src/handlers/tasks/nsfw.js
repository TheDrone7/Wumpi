module.exports = {
    name: 'nsfw',
    description: 'Set your channel to nsfw only mode.',
    guildOnly: true,
    cooldown: 60,
    aliases: ['channel nsfw', 'set channel nsfw'],
    permissionsRequired: ['ADMINISTRATOR'],
    args: false,
    usage: '[command name]',
    /**
     * @param message
     * @param args
     */
    execute(message, args) {
        if (message.channel.nsfw) {
            message.channel.setNSFW(false, 'Automatic.');
            message.reply('NSFW turned off in ' + message.channel.name + '.')
        } else {
            message.channel.setNSFW(true, 'Automatic.');
            message.reply('NSFW turned on in ' + message.channel.name + '.')
        }
    }
};