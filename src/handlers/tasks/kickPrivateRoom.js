const Discord = require("discord.js");
const PrivateRoomSchema = require('../../lib/privateRoomsdb.js');
const { Roles } = require('../privateRoomProperties/roles.js');

module.exports = {
    name: 'pkick',
    description: 'Kicks the user and sends a kicked message.',
    aliases: ['pk'],
    permissionsRequired: null,
    usage: '@user',
    args: true,
    guildOnly: true,
    /**
     * @param message {Discord.Message}
     * @param args {String[]}
     * @param client {Discord.Client}
     * @returns {Promise<Message | Message[]> | *}
     */
    execute(client, message, args) {
        const ownerId = message.channel.name.split('-')[1];
        PrivateRoomSchema.findOne({ userId : ownerId }, (err, result) => {
          if(err) return console.error(err);
          if(!result)
            return message.channel.send("This channel doesn't look like a private channel");
          
          const channelIndex = result.rooms.findIndex(room => room.roomId === message.channel.id);
          if(channelIndex === -1) 
            return message.channel.send("Wasn't able to get channel");

          const myself = result.rooms[channelIndex].roles.find(role => role.id === message.author.id);
          if(!myself)
            return message.channel.send("Wasn't able to get your data");

          const isAdmin = myself.allow.length === Roles.owner.length || myself.allow.length === Roles.admin.length;
          if(!isAdmin)
            return message.channel.send("You need to be a admin to kick users from this private channel!");

          const kickedUsers = message.mentions.members.array();
          if(!kickedUsers) 
            return message.channel.send("You need to tag user who should be kicked");

          if(kickedUsers.find(user => user.id === message.author.id)) 
            return message.channel.send("You can't kick yourself!");

          const myPerms = result.rooms[channelIndex].roles.find(role => role.id === message.author.id).allow;

          const ErrorMessage = {};
          kickedUsers.forEach(user => {
            var index = result.rooms[channelIndex].roles.findIndex(role => role.id === user.id);
            var role = result.rooms[channelIndex].roles[index];
            if(role.allow.length >= myPerms) {
              ErrorMessage[message.guild.members.find(memb => memb.id === role.id).user.username] = {
                error: `Same or higher permissions`
              }
            } else {
              result.rooms[channelIndex].roles.splice(index, 1);
            }
          });

          if(Object.keys(ErrorMessage).length > 0)
            return message.channel.send("```" + JSON.stringify(ErrorMessage) + "```");

          message.channel.replacePermissionOverwrites({
            overwrites: result.rooms[channelIndex].roles
          })
          .catch(console.error());

          message.channel.send(kickedUsers.map(user => {
            return "Kicked " + user.user.username 
          }));

          PrivateRoomSchema.findOneAndUpdate({ userId : ownerId }, result, (err, updated) => {
            if(err) return console.error(err);
          });

        })
    }
};