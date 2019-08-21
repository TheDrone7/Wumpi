const Discord = require('discord.js');
const { Roles } = require('./roles.js');

/** 
*@param args {String[]}
*@param message {Discord.Message}
*/
const Validate = (args, message) => {
  const input = {
    Errors: {},
    Valid: []
  }

  const Users = new Array();
  
  args.forEach(val => {
    var username = val.split(':')[0].toLowerCase();
    var role = null;
    if(val.split(':').length <= 1) {
      input.Errors["role"] = {
        errorCode: 6,
        errorMessage: "invalid, add a role"
      }
    } 
    else {
     role = val.split(':')[1].toLowerCase();
    }
    var member = message.guild.members.find(member => member.user.username.split(' ').join('').toLowerCase() === username);

    if(member) {
      if(Users.includes(username)) {
        input.Errors[username] = {
          errorCode: 4,
          errorMessage: "Is already in the list"
        }
      }
      else {
        Users.push(username);
      }

      if(member.id === message.author.id) {
        input.Errors[username] = {
          errorCode: 5,
          errorMessage: "Author can't include himself"
        }
      }

      GetRole(input, role, member);

    } 
    else {

      input.Errors[username] = {
        errorCode: 1,
        errorMessage: "User doesn't exist"
      }

    }
  });
  return input;
}

/**
 * @param input {{Errors: {}, Valid: Discord.PermissionOverwrites[]}
 * @param role {String}
 * @param member {Discord.GuildMember}
 */
const GetRole = (input, role, member) => {
  if(!(role in Roles)) {
    return input.Errors[role] = {
      errorCode: 2,
      errorMessage: "Role doesn't exist"
    };
  }

  if(role === "owner") {
    return input.Errors[role] = {
      errorCode: 3,
      errorMessage: "You can't set the owner manually"
    }
  }
  
  input.Valid.push({
    type: "member",
    allow: Roles[role],
    id: member.id
  });
}

module.exports = { Validate };