const mongoose = require("mongoose")
const Discord = require("discord.js")

const Backup = require('../../lib/backupdb.js');

module.exports = {
    name: 'load',
    description: 'Load your backup to a server (THIS WILL RESET THE GUILD WHERE YOU GONNA LOAD THE BACKUP)',
    guildOnly: true,
    cooldown: 10,
    aliases: [''],
    args: true,
    usage: '[command name] "keys"',
    execute: (Client, message, args) => {
      Backup.findOne({
        key: args[0]
        //authorId: message.author.id
      }, async (err, backup) => {
        if(err) {
          console.log(err);
        }
        
        if(!backup) {
          message.channel.send("Failed to load a backup! Please check your typings!")
          return;
        } else {
          var Bot = await message.guild.members.get(Client.user.id);
          var GuildRoles = await message.guild.roles.array();
          
          //Bot must have highest role to run this command, otherwise there will be problems with setting up role poitions
          if(!HasUserHighestRole(Bot, GuildRoles)) return message.channel.send('Sorry, but I need to have the highest role to proceed!');
          
          //clears whole server
          let allC = await message.guild.channels
          await allC.forEach(async channel => {
            channel.delete()
            .then(() => "Deleted channel: " + channel.name)
            .catch((e) => console.log(e))
          });

          let allRoles = await message.guild.roles;
          await allRoles.forEach(async r => {
            if(r.name !== "@everyone" && r.editable) { //everyone cant be deleted
              if(!r.managed) { //same as managed roles
                r.delete()
                .then(() => console.log('Deleted: ' + r.name))
                .catch(e => console.log(e)); 
              }
            }
          });
          
          //Many timeouts to prevent that the bot calls functions before certain objects are made such as roles
          setTimeout(() => {
            CreateRoles(backup, message, Client);
            setTimeout(() => {
              CreateChannelsWithPerms(backup, message, Client);
              setTimeout(() => {
                SetEachChannelToItsParent(Client, backup, message);
                message.author.send("Finished backup").catch(console.error());
              }, 20000)
            }, 20000)
          }, 20000);
        }
    });
  }
}
          
async function CreateRoles(backup, message, client) {
          
  let loadRoles = await backup.guild.roles
  //test purpose only
  console.log(loadRoles);

  await loadRoles.forEach(async r => {
            
    if(r.name !== "@everyone" && !r.managed) { //Dont use roles which cant be removed, otherwise they duplicate, check by role.managed
      await message.guild.createRole({
        name: r.name,
        color: r.color,
        permissions: r.permission,
        mentionable: r.mentionable,
        hoist: r.hoist
      }).then(role => {

        console.log('Role created\n' + role.name);

      }).catch(e => {
        console.log(e + "\n" + r.name);
      });
    }
  });      
}
          
async function CreateChannelsWithPerms(backup, message, client) {
          
  //Restore all channels
  let loadChannels = backup.channels
  for(var i = 0; i < loadChannels.length; i++) {
    let name = await loadChannels[i].name
    let type = await loadChannels[i].type
    console.log(name + "\n" + type);
    let position = await parseInt(loadChannels[i].position)
    let rateLimit;
    if(type === "text") {
      rateLimit = loadChannels[i].rateLimitPerUser
    } else {
      rateLimit = undefined
    }

    let permArray = [];
    let perms = await loadChannels[i].permission;

    //Parsing data to JSON and then parse it to js again, to remove Doc class then checking each key, because its rlly strange saved
    // exc.: [{key: value}, {...}] instead of [{Data}, {Data}]
    perms.forEach(async permission => {

      console.log(permission);

      if(permission.type === "member") {
      console.log('Member');
        permArray.push({
          id: permission.id,
          allow: permission.allow,
          deny: permission.deny
        });
      }  
      else if(permission.type === "role") {
          
        var role = client.guilds.get(message.guild.id).roles.find(role => role.name === permission.name);
        if(!role) return console.log('Wasnt able to find role');
        
        console.log(`Pushing ${role.name} with the perm map of ${permission.deny} and ${permission.allow}`);
                      
        permArray.push({
          id: role.id,
          allow: permission.allow,
          deny: permission.deny
        });
      }
    });

    await message.guild.createChannel(name, { 
      type: type,
      position: position,
      rateLimitPerUser: rateLimit,
      permissionOverwrites: permArray

    }).then((chan) => {
      console.log(`${chan.name} got overwritten`) 
    }).catch((e) => console.log(e))
  }
}
          
async function SetEachChannelToItsParent(client, backup, message) {
  var Roles = await client.guilds.get(message.guild.id).roles;
  var SavedRoles = await backup.guild.roles;
  
  Roles.forEach(role => {
    if(role.name !== "@everyone") {
      SavedRoles.forEach(savedRole => {
        if(role.name === savedRole.name) {
          role.setPosition(savedRole.position)
          .then(() => console.log(`Set position of ${role.name} to position ${savedRole.position}`))
          .catch((e) => console.log(e));
        }
      })
    }
  });
  
  //Set each channel to its parent from before
  var AllChannels = await backup.channels;
  AllChannels.forEach(NewChan => {
    if(NewChan.type === "category") {
      var Childs = NewChan.childs;
      Childs.forEach(async child => {
        var channel = await client.guilds.get(message.guild.id).channels.find(c => c.name === child.name && c.type === child.type);
        var newCategory = await client.guilds.get(message.guild.id).channels.find(c => c.name === NewChan.name);
        if(channel && newCategory) {
          channel.setParent(newCategory.id)
          .then(() => console.log(`Set ${channel.name} to category ${newCategory.name}`))
          .catch((e) => console.log(e));
        } else 
          console.log('Something went wrong while trying to get new channel');
      });
    }
  });
}

//Bot has to have the highest role, so it doesnt throw any missing permissions errors
function HasUserHighestRole(User, GuildRoles) {
  var memberRoles = User.roles.array();
  for(var i = 0; i < memberRoles.length; i++) {
    if(memberRoles[i].calculatedPosition >= (GuildRoles.length - 1)) return true;
    if(i === memberRoles.length - 1) return false;
  }
  return false;
}