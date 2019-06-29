const mongoose = require("mongoose");
const Backup = require("../../lib/backupdb.js");
const Discord = require("discord.js");

module.exports = {
    name: 'load',
    description: 'Load your backup to a server (THIS WILL RESET THE GUILD WHERE YOU GONNA LOAD THE BACKUP)',
    guildOnly: true,
    cooldown: 10,
    aliases: [''],
    args: true,
    usage: '[command name] "keys"',
    execute(client, message, args) {
        Backup.findOne({
            key: args[0]
            //authorId: message.author.id
        }, async (err, backup) => {
            if (err) {
                console.log(err)
            }

            if (!backup) {
                message.channel.send("Failed to load a backup! Please check your typings!");

            } else {
                //clears whole server
                let allC = await message.guild.channels;
                await allC.forEach(c => {
                    c.delete()
                });

                let allR = await message.guild.roles;
                await allR.forEach(r => {
                    if (r.name !== "@everyone") {
                        r.delete()
                    }
                });

                //load and delete @everyone role
                let loadRoles = await backup.guild.roles;

                for (var i = 0; i < loadRoles.length; i++) {
                    if (loadRoles[i].name === "@everyone") {
                        loadRoles.splice(i, 1);
                        backup.save()
                    }
                }

                //create every roles
                await loadRoles.forEach(r => {
                    message.guild.createRole({
                        name: r.name,
                        color: r.color,
                        position: r.position,
                        permissions: r.permission,
                        mentionable: r.mentionable,
                        hoist: r.hoist
                    })
                });

                let loadChannels = await backup.channels;
                loadChannels.forEach(async (ca) => {
                    let name = await ca.name;
                    let type = await ca.type;
                    let position = await parseInt(ca.position);
                    let rateLimit;
                    if (type === "text") {
                        rateLimit = ca.rateLimitPerUser
                    } else {
                        rateLimit = undefined
                    }

                    let permArray = {};
                    let perms = await ca.permission;
                    console.log(perms);
                    perms.forEach(async (pe, index, arr) => {
                        if (pe.size < 0) {
                            return;
                        }

                        // function getPermName(bitfield = 0) {
                        //   for (let key in Discord.Permissions.FLAGS)
                        //   if (Discord.Permissions.FLAGS[key] == bitfield) return key;
                        //   return null;
                        // }

                        if (pe.type === "member") {
                            permArray[pe.id] = {
                                id: pe.id,
                                allow: pe.allow,
                                deny: pe.deny
                            };
                            return;
                        }

                        if (pe.name === "@everyone") {
                            permArray[message.guild.id] = {
                                id: message.guild.id,
                                allow: pe.allow,
                                deny: pe.deny
                            };
                            return;
                        }

                        try {
                            let role = message.guild.roles.find(r => r.name === pe.name);
                            if (!role) {
                                return;
                            }

                            permArray[role.id] = {
                                role: loadRoles[index],
                                allow: pe.allow,
                                deny: pe.deny
                            }
                        } catch (err) {
                            if (err) {
                                throw(err)
                            }
                        }
                    });

                    await console.log(permArray);
                    var channel = await message.guild.createChannel(name, {
                        type: type,
                        position: position,
                        rateLimitPerUser: rateLimit
                    });
                    channel.overwritePermissions()
                })
            }
        })
    }
};