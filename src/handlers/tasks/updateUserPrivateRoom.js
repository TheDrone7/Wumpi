const Discord = require("discord.js");
const PrivateRoomSchema = require('../../lib/privateRoomsdb.js')
const { Roles } = require('../privateRoomProperties/roles.js');
const { ValidateRoomSelection } = require('../privateRoomProperties/validateRoomsOnGuild.js');
const { Validate } = require('../privateRoomProperties/validateInput.js');

module.exports = {
    name: 'pupgrade',
    description: 'upgrades the role of the user',
    aliases: ['pu'],
    permissionsRequired: null,
    usage: '[command name] chat:index user:role',
    args: true,
    guildOnly: true,
    /**
     * @param message {Discord.Message}
     * @param args {String[]}
     * @param client {Discord.Client}
     * @returns {Promise<Message | Message[]> | *}
     */
    execute(client, message, args) {
      PrivateRoomSchema.findOne({ userId : message.author.id }, (err, result) => {
        if(err) return console.error(err);
        if(!result)
          return message.channel.send("You dont have any private rooms yet. Create one by typing -privateroom");

        if(!args) 
          return message.channel.send("No chat and user found");

        const { errorMessage, index } = ValidateRoomSelection(result, message, args);
        if(errorMessage) 
          return message.channel.send(errorMessage);

        const myChannel = message.guild.channels.find(chan => chan.name === `private-${message
        .author.id}-${index}`);
        if(!myChannel)
          return message.channel.send("Wasn't able to find your channel");

        const users = args.splice(1);
        
        var IS_OWNER_SELECTED = false;
        users.forEach(user => {
          if(message.guild.members.find(member => member.user.username.split(' ').join('').toLowerCase() === user.split(':')[0].toLowerCase()).id == message.author.id) {
            IS_OWNER_SELECTED = true;
          }
        });
        if(IS_OWNER_SELECTED) 
          return message.channel.send("You can't overwrite the owner");

        const { Errors, Valid } = Validate(users, message);
        if(Object.keys(Errors).length > 0) 
          return message.channel.send("Some errors occured```" + JSON.stringify(Errors) + "```");

        const foundChannelIndex = result.rooms.findIndex(room => room.roomId === myChannel.id);
        if(foundChannelIndex === -1)
          return message.channel.send("Wasn't able to find your channel");
        
        var { roles } = result.rooms[foundChannelIndex];
        const foundEveryone = roles.findIndex(role => role.type === "role");
        roles.splice(foundEveryone, 1);

        const newInfo = ChangeUserRoles(roles, Valid);

        roles.forEach((role, num) => {
          Valid.forEach(newRole => {
            if(role.id === newRole.id) {
              if(newInfo[num].from !== newInfo[num].to) {
                var resultIndex = result.rooms[foundChannelIndex].roles.findIndex(_role => _role.id === role.id);
                result.rooms[foundChannelIndex].roles[resultIndex] = newRole;
              }
            }
          });
        });

        result.rooms[foundChannelIndex].roles.push({
          type: "role",
          deny: ["READ_MESSAGES", "SEND_MESSAGES", "ADD_REACTIONS", "USE_EXTERNAL_EMOJIS"],
          id: message.guild.id
        });

        const resultMessage = newInfo.map(info => {
          const member = message.guild.members.get(info.id);
          if(info.from !== info.to) {
            return `${member.user.username} got ${info.upgraded ? "upgraded" : "downgraded"} from ${info.from} to ${info.to}`;
          }
        });

        myChannel.send(resultMessage.join('') ? resultMessage.join('\n') : "All users had his/her role already")
        .catch(console.error());

        myChannel.replacePermissionOverwrites({
          overwrites: result.rooms[foundChannelIndex].roles
        })
        .catch(console.error());

        PrivateRoomSchema.findOneAndUpdate({ userId: message.author.id }, result, (err, updated) => {
          if(err) return console.error(err);
        });
      });
    }
};

/**
 * @param oldRoles {[{type: String, allow: Discord.Permissions[], id: String}]}
 * @param newRoles {[{type: String, allow: Discord.Permissions[], id: String}]}
 */
const ChangeUserRoles = (oldRoles, newRoles) => {

  const upgradeInfo = new Array();
  oldRoles.forEach((oldRole) => {
    var oldRoleName = GetRoleName(oldRole.allow);
    var newPerms = newRoles.find(role => role.id === oldRole.id);
    var newRoleName = newPerms ? GetRoleName(newPerms.allow) : oldRoleName;

    upgradeInfo.push({
      id: oldRole.id,
      from: oldRoleName,
      to: newRoleName,
      upgraded: isUpgraded(oldRoleName, newRoleName)
    });

  });
  return upgradeInfo;
}

/**
 * @param Permissions {Discord.Permissions[]}
 */
const GetRoleName = (Permissions) => {
  var roleName = "";
  Object.keys(Roles).forEach(key => {
    if(Roles[key].length === Permissions.length) {
      roleName = key;
    }
  });
  return roleName;
}

/**
 * @param oldRoleName {String}
 * @param newRoleName {String}
 */
const isUpgraded = (oldRoleName, newRoleName) => {
  if(oldRoleName === newRoleName) 
    return false;

  switch(oldRoleName) {
    case "owner": {
      return false;
    }
    case "admin": {
      switch(newRoleName) {
        case "writer":
          return false
        case "reader":
          return false
      }
    }
    case "writer":
      switch(newRoleName) {
        case "reader":
          return false;
        case "admin":
          return true;
      }
    case "reader":
      switch(newRoleName) {
        case "writer":
          return true;
        case "admin":
          return true;
      }
  }
}