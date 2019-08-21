const Discord = require("discord.js");
const PrivateRoomSchema = require('../../lib/privateRoomsdb.js');

module.exports = {
    name: 'pclose',
    description: 'closes the private channel',
    aliases: ['pc'],
    permissionsRequired: null,
    usage: 'None',
    args: false,
    guildOnly: true,
    /**
     * @param message {Discord.Message}
     * @param args {String[]}
     * @param client {Discord.Client}
     * @returns {Promise<Message | Message[]> | *}
     */
    execute(client, message, args) {
        const ownerId = message.channel.name.split('-')[1];
        PrivateRoomSchema.findOne({ userId: ownerId }, (err, result) => {
          if(err) return console.error(err);

          if(!result) 
            return message.channel.send("This channel doesn't look like a private channel");

            const author = message.author;
            const channel = message.channel;
          if(ownerId !== author.id) 
            return channel.send("You need to be the owner of this channel to close that channel");

          const index = result.rooms.findIndex(room => room.roomId === channel.id);
          result.rooms.splice(index, 1);

          PrivateRoomSchema.findOneAndUpdate({ userId: ownerId }, (result), (err, updated) => {
            if(err) return console.error(err);
          })

          message.channel.delete()
          .catch(console.error());
        })
    }
};