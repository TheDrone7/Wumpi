const mongoose = require("mongoose")

const Backup = require("/app/src/lib/backupdb.js")

module.exports = {
    name: 'backup',
    description: 'Initialize backup function',
    guildOnly: true,
    permissionsRequired: ['ADMINISTRATOR'],
    cooldown: 25,
    aliases: [],
    usage: '[command name]',
    execute(client, message, args) {
        //if (message.author.id !== message.guild.ownerID) return message.channel.send("Your not the owner of this server or you don't have `MANAGE_GUILD` permission")
        Backup.findOne({
            id: message.guild.id
        }, async (err, guild) => {
            if (err) {
                console.log(err)
            }

            if (!guild) {
                var Bot = await message.guild.members.get(client.user.id);
                var GuildRoles = await message.guild.roles.array();
                console.log(GuildRoles.length);
                
                var result = HasSameClasses(client, message);
                
                if(result === 1) return message.channel.send("You have two channels of the same type with the same name, rename one!");
                else if (result === 2) return message.channel.send("You have two roles with the same name, rename one!");
              
                //Check if bot has highest role
                var hasHighestRole = HasUserHighestRole(Bot, GuildRoles);
                console.log(hasHighestRole);
                if(!hasHighestRole) return message.channel.send('Sorry, but the bot must have the highest role to proceed!');
                //generate key
                var result = '';
                var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%&#*!()';
                var charactersLength = characters.length;

                for (var i = 0; i < 10; i++) {
                    result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
                //===============================

                //get guild properties
                let name = message.guild.name;
                let region = message.guild.region;
                let originalID = message.guild.id;
                let contentFilter = message.guild.explicitContentFilter;
                let iconURL = message.guild.iconURL;

                let afkChannelName; //= message.guild.afkChannel.name;
                let afkChannelTimeout; //= message.guild.afkTimeout;             
                if(message.guild.afkChannel) {
                  afkChannelName = message.guild.afkChannel.name;
                  afkChannelTimeout = message.guild.afkTimeout;
                } else {
                  afkChannelName = undefined;
                  afkChannelTimeout = undefined;
                }

                //get role
                let temp = []
                let roles = message.guild.roles;
                roles.forEach(r => {
                    let name = r.name;
                    let permission = r.permissions
                    let position = r.calculatedPosition
                    let color = r.color
                    let hoist = r.hoist
                    let mentionable = r.mentionable
                    let id = r.id
                    let managed = r.managed

                    temp.push({
                        name: name,
                        permission: permission,
                        position: position,
                        id: id,
                        managed: managed,
                        hoist: hoist,
                        mentionable: mentionable,
                        color: color
                    })
                })
                //===================================

                //get channels properties
                let temp2 = []
                let channels = message.guild.channels;
                await CheckForCategories(message);
                channels.forEach(async c => {
                    let name = c.name;
                    //let pinnedMsg = [];
                    let parent;
                    let childs = null;
                    if(c.type === "category") {
                      var catobj = await CategoryChilds.find(x => x.name === c.name);
                      childs = catobj.childs;
                    }
                    let permissions = new Array(); 
                    let permission1 = c.permissionOverwrites
                    permission1.forEach((pe) => {
                      if(pe.type === "member")
                        return;
                      
                      let name = message.guild.roles.find(r => r.id === pe.id).name
                      
                      pe.name = name;
                      
                      permissions.push(pe);
            
                    });
                  
                    let id = c.id;
                    let position = c.calculatedPosition;
                    let type = c.type;
                    let rateLimit;
//                   
    
                    switch (type) {
                        case "category":
                            parent = null
                            rateLimit = undefined
                            break;
                        
                        case "voice":
                            if(!c.parent) {
                              parent = null
                            } else {
                              parent = c.parent.name
                            }
                            break

                        default:
                            if(!c.parent) {
                              parent = null
                              rateLimit = c.rateLimitPerUser
                            } else {
                              parent = c.parent.name
                              rateLimit = c.rateLimitPerUser
                            }
                            break;
                    }

                    temp2.push({
                        name: name,
                        parent: parent,
                        childs: childs,
                        id: id,
                        permission: permissions,
                        position: position,
                        rateLimit: rateLimit,
                        type: type
                    })
                })
                //===================================

                const newBackup = new Backup({
                    key: result,
                    id: originalID,
                    authorId: message.author.id, 
                    guild: {
                        name: name,
                        region: region,
                        filter: contentFilter,
                        icon: iconURL,
                        afkChannel: {
                            name: afkChannelName,
                            timeout: afkChannelTimeout,
                        },
                        roles: temp,
                    },
                    channels: temp2
                })
                
                message.channel.send("Successfuly initialized a backup! " + message.author + ", please keep the key private! *This key will only work with you*")
                message.author.send("SAVE THIS! `" + result + "`")
              return newBackup.save()
            } else {
              message.channel.send("You already initialize a backup!")
            }
        })
    }
}

function HasUserHighestRole(User, GuildRoles) {
  var memberRoles = User.roles.array();
  for(var i = 0; i < memberRoles.length; i++) {
    console.log(`Role: ${memberRoles[i].name}\nPosition: ${memberRoles[i].calculatedPosition}`)
    if(memberRoles[i].calculatedPosition === (GuildRoles.length - 1)) return true;
    if(i === memberRoles.length - 1) return false;
  }
  return false;
}

let CategoryChilds = [];

function CheckForCategories(message) {
  
  //First getting each category and setting up its properties
  message.guild.channels.forEach(channel => {
    if(channel.type === "category") {
      CategoryChilds.push({
        id: channel.id,
        name: channel.name,
        childs: []
      });
    }
  });
  //Then getting each channel
  message.guild.channels.forEach(channel => {
    GetChilds(channel, message);
  });
}

function GetChilds(channel, message) {
  //And checking if it is a child of a certain category
  if(channel.type !== "category" && channel.type !== "dm") {
    CategoryChilds.forEach(async child => {
      var chanCat = await message.guild.channels.get(channel.parentID);
      if(chanCat) {
        if(child.name === chanCat.name && chanCat) {
          child.childs.push({
            name: channel.name,
            type: channel.type
          });
        }
      }
    });
  }
}

function HasSameClasses(client, message) {
  var isChannel = false;
  var isRole = false;
  var Channels = {};
  client.guilds.get(message.guild.id).channels.forEach(chan => {
    if(chan.name in Channels) {
      if(Channels[chan.name].type === chan.type) isChannel = true;
    } else {
      Channels[chan.name] = { type: chan.type };
    }
  });
  if(isChannel) return 1;
  
  var Roles = {};
  client.guilds.get(message.guild.id).roles.forEach(role => {
    if(role.name in Roles) {
      isRole = true;
    } else {
      Roles[role.name] = { name: role.name };
    }
  });
  if(isRole) return 2;
  
  return 0;
}