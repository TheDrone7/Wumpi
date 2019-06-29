const mongoose = require("mongoose");
 const Backup = require("../../lib/backupdb.js");

module.exports = {
    name: 'backup',
    description: 'Initialize backup function',
    guildOnly: true,
    permissionsRequired: ['ADMINISTRATOR'],
    cooldown: 25,
    aliases: [''],
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
                let temp = [];
                let roles = message.guild.roles;
                roles.forEach(r => {
                    let name = r.name;
                    let permission = r.permissions;
                    let position = r.calculatedPosition;
                    let color = r.color;
                    let hoist = r.hoist;
                    let mentionable = r.mentionable;
                    let id = r.id;

                    temp.push({
                        name: name,
                        permission: permission,
                        position: position,
                        id: id,
                        hoist: hoist,
                        mentionable: mentionable,
                        color: color
                    })
                });
                //===================================

                //get channels properties
                let temp2 = [];
                let channels = message.guild.channels;
                channels.forEach(c => {
                    let name = c.name;
                    //let pinnedMsg = [];
                    let parent;
                    let permission1 = c.permissionOverwrites;
                    permission1.forEach((pe) => {
                        if (pe.type === "member") {
                            return;
                        }

                        let name = message.guild.roles.find(r => r.id === pe.id).name;
                        // if(name === "@everyone") {
                        //   return;
                        // }

                        pe.name = name
                    });

                    let permission = [permission1];
                    let id = c.id;
                    let position = c.calculatedPosition;
                    let type = c.type;
                    let rateLimit;
//

                    switch (type) {
                        case "category":
                            parent = null;
                            rateLimit = undefined;
                            break;

                        case "voice":
                            if (!c.parent) {
                                parent = null
                            } else {
                                parent = c.parent.name
                            }
                            break;

                        default:
                            if(!c.parent) {
                                parent = null;
                                rateLimit = c.rateLimitPerUser
                            } else {
                                parent = c.parent.name;
                                rateLimit = c.rateLimitPerUser
                            }
                            break;
                    }

                    temp2.push({
                        name: name,
                        parent: parent,
                        id: id,
                        permission: permission,
                        position: position,
                        rateLimit: rateLimit,
                        type: type
                    })
                });
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
                });

                message.channel.send("Successfuly initialized a backup! " + message.author + ", please keep the key private! *This key will only work with you*");
                message.author.send("SAVE THIS! `" + result + "`");
                return newBackup.save()
            } else {
                message.channel.send("You already initialize a backup!")
            }
        })
    }
};