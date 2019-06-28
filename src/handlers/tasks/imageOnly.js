const guildSettings = require('../../lib/guilddb');

module.exports = {
    name: 'imageonly',
    description: 'Set your channel to image only mode. Removes all text from channel.',
    guildOnly: true,
    cooldown: 60,
    permissionsRequired: ['ADMINISTRATOR'],
    aliases: ['image', 'set channel imageonly', 'set channel image'],
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
            if (g.imageOnlyChannelIDs.length === 0) {
                g.imageOnlyChannelIDs = [currentChannel];
                g.save();
                message.reply('Added `image-only` to `' + message.channel.name + '`.');
                console.log('Added image-only to ' + message.channel.name);
            } else {
                g.imageOnlyChannelIDs.forEach(c => {
                    if (c === currentChannel) {
                        g.channels.imageOnlyChannelIDs = g.channels.imageOnlyChannelIDs.remove(currentChannel);
                        g.save();
                        message.reply('Removed `bot-only` from `' + message.channel.name + '`.');
                        console.log('Removed bot-only from ' + message.channel.name);
                    } else {
                        g.channels.imageOnlyChannelIDs = g.channels.imageOnlyChannelIDs.push(currentChannel);
                        g.save();
                        message.reply('Added `image-only` to `' + message.channel.name + '`.');
                        console.log('Added image-only to ' + message.channel.name);
                    }
                });
            }
        });
    }
};