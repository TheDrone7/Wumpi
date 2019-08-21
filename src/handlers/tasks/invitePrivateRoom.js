const Discord = require("discord.js");
const PrivateRoomSchema = require('../../lib/privateRoomsdb.js');
const { Validate } = require('../privateRoomProperties/validateInput.js');
const { ValidateRoomSelection } = require('../privateRoomProperties/validateRoomsOnGuild.js');

module.exports = {
    name: 'pinvite',
    description: 'Invites a new user to your private room',
    aliases: ['pi'],
    permissionsRequired: null,
    usage: 'chat:index user:role',
    args: true,
    guildOnly: true,
    /**
     * @param message {Discord.Message}
     * @param args {String[]}
     * @param client {Discord.Client}
     * @returns {Promise<Message | Message[]> | *}
     */
    execute(client, message, args) {
      PrivateRoomSchema.findOne({ userId: message.author.id }, (err, result) => {
        if(err) return console.error(err);
        if(!result) 
          return message.channel.send("You dont have any private channels.\nUse -privateroom to initialize one");

        const { errorMessage, index } = ValidateRoomSelection(result, message, args);
        if(errorMessage)
          return message.channel.send(errorMessage);
         
        const users = args.splice(1);
        if(!users)
          return message.channel.send("You need to enter some users to actually invite some");

        const { Errors, Valid } = Validate(users, message);

        if(Object.keys(Errors).length > 0) 
          return message.channel.send("Some errors occured```" + JSON.stringify(Errors) + "```");

        const selectedRoom = message.guild.channels.find(chan => chan.name === `private-${message.author.id}-${index}`);
        if(!selectedRoom)
          return message.channel.send("Wasn't able to find that private channel on this guild");

        const foundRoom = result.rooms.findIndex(_room => _room.roomId === selectedRoom.id);
        if(foundRoom === -1)
          return message.channel.send("This error shouldn't happen, please inform our developers!");

        var USER_EXISTS = {
          id: null,
          exists: false
        }
        result.rooms[foundRoom].roles.forEach(roles => {
          Valid.forEach(permission => {
            if(roles.id === permission.id) {
              USER_EXISTS.id = roles.id;
              USER_EXISTS.exists = true;
            }
          });
        });
        if(USER_EXISTS.exists)
          return message.channel.send(`${message.guild.members.get(USER_EXISTS.id).user.username} is already a member of your private channel!`);
        
        Valid.forEach(permission => {
          result.rooms[foundRoom].roles.push({
            type: permission.type,
            allow: permission.allow,
            id: permission.id
          });
        });

        const channel = message.guild.channels.find(chan => chan.id === result.rooms[foundRoom].roomId);
        if(!channel)
          return message.channel.send("Error while trying to receive your channel");

        channel.replacePermissionOverwrites({
          overwrites: result.rooms[foundRoom].roles
        })
        .then(() => {
          channel.send(`${users.map(user => user.split(':')[0])} got invited`)
          .catch(console.error());
        })
        .catch(console.error());

        PrivateRoomSchema.findOneAndUpdate({ userId : message.author.id }, result, (err, updated) => {
          if(err) return console.error(err);
        })
      });
    }
};