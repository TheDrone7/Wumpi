const guildSettings = require('../../lib/guilddb');

module.exports = {
    name: 'botonly',
    description: 'Set your channel to bot only mode. Prevents users from talking in this channel.',
    guildOnly: true,
    cooldown: 30,
    permissionsRequired: ['ADMINISTRATOR'],
    aliases: ['bot', 'set channel bot'],
    args: false,
    usage: '[command name]',
    /**
     * @param message
     * @param args
     */
    execute(client, message, args) {
        const currentGuildID = message.guild.id;
        const currentChannel = message.channel.id;
        guildSettings.findOne({
            id: currentGuildID
        }, (err, g) => {
            if (err) return console.log(err);

            var isImageOnly = g.channels.imageOnlyChannelIDs.find(c => c === currentChannel);
            if (isImageOnly) return message.channel.send('This channel is already set to "Images only"');
            var isUserOnly = g.channels.userOnlyChannelIDs.find(c => c === currentChannel);
            if (isUserOnly) return message.channel.send('This channel is already set to "Users only"');
          
            if (g.channels.botOnlyChannelIDs.length === 0) {
                g.channels.botOnlyChannelIDs.push(currentChannel);
                guildSettings.findOneAndUpdate({id: currentGuildID}, g, (err) => {
                    if (err) throw err;
                });
                message.reply('Added `bot-only` to `' + message.channel.name + '`.');
                console.log('Added bot-only to ' + message.channel.name);
            } else {
                var BotChannels = g.channels.botOnlyChannelIDs;
                for (var i = 0; i < BotChannels.length; i++) {
                    if (BotChannels[i] === currentChannel) {
                        g.channels.botOnlyChannelIDs.splice(i, 1);
                        guildSettings.findOneAndUpdate({id: currentGuildID}, g, (err) => {
                            if (err) throw err;
                        });
                        message.reply('Removed `bot-only` from `' + message.channel.name + '`.');
                        console.log('Removed bot-only from ' + message.channel.name);
                        break;
                    } else if (i === BotChannels.length - 1) {
                        g.channels.botOnlyChannelIDs.push(currentChannel);
                        guildSettings.findOneAndUpdate({id: currentGuildID}, g, (err) => {
                            if (err) throw err;
                        });
                        message.reply('Added `bot-only` to `' + message.channel.name + '`.');
                        console.log('Added bot-only to ' + message.channel.name);
                        break;
                    }
                }
            }
        });
    }
};