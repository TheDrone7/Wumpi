const guildSettings = require('../../lib/guilddb');

module.exports = {
    name: 'imageonly',
    description: 'Set your channel to image only mode. Removes all text from channel.',
    guildOnly: true,
    cooldown: 30,
    permissionsRequired: ['ADMINISTRATOR'],
    aliases: ['image', 'set channel imageonly', 'set channel image'],
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
          
            var isBotOnly = g.channels.botOnlyChannelIDs.find(c => c === currentChannel);
            if (isBotOnly) return message.channel.send('This channel is already set to "Bot only"');
            var isUserOnly = g.channels.userOnlyChannelIDs.find(c => c === currentChannel);
            if (isUserOnly) return message.channel.send('This channel is already set to "Users only"');
          
            if (g.imageOnlyChannelIDs.length === 0) {
                g.imageOnlyChannelIDs.push(currentChannel);
                guildSettings.findOneAndUpdate({id: currentGuildID}, g, (err) => {
                  if(err) throw err;
                })
                message.reply('Added `image-only` to `' + message.channel.name + '`.');
                console.log('Added image-only to ' + message.channel.name);
            } else {
                var ImageOnlyChannels = g.channels.imageOnlyChannelIDs;
                for(var i = 0; i < ImageOnlyChannels.length; i++) {
                    if (ImageOnlyChannels[i] === currentChannel) {
                        g.channels.imageOnlyChannelIDs.splice(i, 1);
                        guildSettings.findOneAndUpdate({id: currentGuildID}, g, (err) => {
                          if(err) throw err;
                        })
                        message.reply('Removed `bot-only` from `' + message.channel.name + '`.');
                        console.log('Removed bot-only from ' + message.channel.name);
                        break;
                    } else if(i === ImageOnlyChannels.length - 1) {
                        g.channels.imageOnlyChannelIDs.push(currentChannel);
                        guildSettings.findOneAndUpdate({id: currentGuildID}, g, (err) => {
                          if(err) throw err;
                        })
                        message.reply('Added `image-only` to `' + message.channel.name + '`.');
                        console.log('Added image-only to ' + message.channel.name);
                        break;
                    }
                }
            }
        });
    }
};