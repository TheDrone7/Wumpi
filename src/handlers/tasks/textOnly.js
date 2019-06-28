const guildSettings = require('../../lib/guilddb');

module.exports = {
    name: 'textonly',
    description: 'Set your channel to text only mode. Prevents bots from talking in this channel.',
    guildOnly: true,
    cooldown: 60,
    permissionsRequired: ['ADMINISTRATOR'],
    aliases: ['text', 'set channel text'],
    args: false,
    usage: '[command name]',
    /**
     * @param message
     * @param args
     */
    execute(message, args) {
        const currentGuildID = message.guild.id;
        const currentChannel = message.channel.id;
        guildSettings.findOne({
            id: currentGuildID
        }, (err, g) => {
            if (err) {
                console.error(err);
            }
            if (g.channels.userOnlyChannelIDs.length === 0) {
                g.channels.userOnlyChannelIDs = [currentChannel];
                g.save();
                message.reply('Added `text-only` to `' + message.channel.name + '`.');
                console.log('Added textonly to ' + message.channel.name);
            } else {
                g.channels.userOnlyChannelIDs.forEach(c => {
                    if (c === currentChannel) {
                        g.channels.userOnlyChannelIDs = g.channels.userOnlyChannelIDs.remove(currentChannel);
                        g.save();
                        message.reply('Removed `text-only` from `' + message.channel.name + '`.');
                        console.log('Removed text-only from ' + message.channel.name);
                    } else {
                        g.userOnlyChannelIDs = g.userOnlyChannelIDs.push(currentChannel);
                        g.save();
                        message.reply('Added `text-only` to `' + message.channel.name + '`.');
                        console.log('Added text-only to ' + message.channel.name);
                    }
                });
            }
        });
    }
};