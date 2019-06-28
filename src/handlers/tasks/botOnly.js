const guildSettings = require('../../lib/guilddb');

module.exports = {
    name: 'botOnly',
    description: 'Set your channel to bot only mode. Prevents users from talking in this channel.',
    guildOnly: true,
    cooldown: 60,
    permissionsRequired: ['ADMINISTRATOR'],
    aliases: ['bot', 'set channel bot'],
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
            if (g.channels.botOnlyChannelIDs.length === 0) {
                g.channels.botOnlyChannelIDs = [currentChannel];
                g.save();
                message.reply('Added `bot-only` to `' + message.channel.name + '`.');
                console.log('Added bot-only to ' + message.channel.name);
            } else {
                g.channels.botOnlyChannelIDs.forEach(c => {
                    if (c === currentChannel) {
                        g.channels.botOnlyChannelIDs = g.channels.botOnlyChannelIDs.remove(currentChannel);
                        g.save();
                        message.reply('Removed `bot-only` from `' + message.channel.name + '`.');
                        console.log('Removed bot-only from ' + message.channel.name);
                    } else {
                        g.channels.botOnlyChannelIDs = g.channels.botOnlyChannelIDs.push(currentChannel);
                        g.save();
                        message.reply('Added `bot-only` to `' + message.channel.name + '`.');
                        console.log('Added bot-only to ' + message.channel.name);
                    }
                });
            }
        });
    }
};