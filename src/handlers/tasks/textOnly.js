const guildSettings = require('../../lib/guilddb');

module.exports = {
    name: 'textonly',
    description: 'Set your channel to text only mode. Prevents bots from talking in this channel.',
    guildOnly: true,
    cooldown: 30,
    permissionsRequired: ['ADMINISTRATOR'],
    aliases: ['text', 'set channel text'],
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
            var isImageOnly = g.channels.imageOnlyChannelIDs.find(c => c === currentChannel);
            if (isImageOnly) return message.channel.send('This channel is already set to "Images only"');
          
            if (g.channels.userOnlyChannelIDs.length === 0) {
                g.channels.userOnlyChannelIDs.push(currentChannel);
                guildSettings.findOneAndUpdate({id: currentGuildID}, g, (err) => { 
                  if(err) throw err;
                });
                message.reply('Added `text-only` to `' + message.channel.name + '`.');
                console.log('Added textonly to ' + message.channel.name);
            } else {
                var ChannelIds = g.channels.userOnlyChannelIDs;
                for(var i = 0; i < ChannelIds.length; i++) {
                    if (ChannelIds[i] === currentChannel) { 
                        g.channels.userOnlyChannelIDs.splice(i, 1);
                        guildSettings.findOneAndUpdate({id: currentGuildID}, g, (err) => { 
                          if(err) throw err;
                        });
                        message.reply('Removed `text-only` from `' + message.channel.name + '`.');
                        console.log('Removed text-only from ' + message.channel.name);
                        break;
                    } else if (i === ChannelIds.length - 1) {
                        g.channels.userOnlyChannelIDs.push(currentChannel);
                        guildSettings.findOneAndUpdate({id: currentGuildID}, g, (err) => { 
                          if(err) throw err;
                        });
                        message.reply('Added `text-only` to `' + message.channel.name + '`.');
                        console.log('Added text-only to ' + message.channel.name);
                        break;
                    }
                }
            }
        });
    }
};