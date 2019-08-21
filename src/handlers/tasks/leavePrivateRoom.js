const Discord = require("discord.js");
const PrivateroomSchema = require('../../lib/privateRoomsdb.js');

module.exports = {
    name: 'pleave',
    description: 'leaves the current private room',
    aliases: ['pl'],
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
      PrivateroomSchema.findOne({ userId: ownerId }, (err, result) => {
        if(err) return console.error(err);

        if(!result) 
          return message.channel.send("This channel doesn't look like a private room");

        const channel = message.channel;
        const author = message.author;

        if(ownerId === author.id) 
          return message.channel.send("You, as the owner, cant leave the channel. You can only close it, so that every user will leave too");

        message.channel.replacePermissionOverwrites({
          overwrites: result.rooms.find(room => room.roomId === channel.id).roles.filter(role => role.id !== author.id)
        })
        .catch(console.error());

        const roles = result.rooms.find(room => room.roomId === channel.id).roles.filter(role => role.id !== author.id);
        result.rooms.find(room => room.roomId === channel.id).roles = roles;

        PrivateroomSchema.findOneAndUpdate({ userId: ownerId }, result, (err, updated) => {
          if(err) return console.error(err);
        });

        message.channel.send(`${message.author.username} left the private room`);
      });
    }
};