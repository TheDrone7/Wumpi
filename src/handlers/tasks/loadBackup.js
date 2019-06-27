/**const mongoose = require("mongoose");
 const Discord = require("discord.js");

 const Backup = require("../../lib/backupdb.js");

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
            key: args[0],
            authorId: message.author.id
        }, async (err, backup) => {
            if(err) {
                console.log(err)
            }

            if(!backup) {
                message.channel.send("Failed to load a backup! Please check your typings!")
                return;
            } else {
                //clears whole server
                let allC = await message.guild.channels
                await allC.forEach(c => {
                    c.delete()
                })

                let allR = await message.guild.roles
                await allR.forEach(r => {
                    r.delete()
                })

                //load and delete @everyone role
                let loadRoles = await backup.guild.roles

                for(var i = 0; i < loadRoles.length; i++) {
                    if(loadRoles[i].name === "@everyone") {
                        loadRoles.splice(i, 1)
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
                })

                //storing
                let category = []
                let text = []
                let voice = []

                let loadChannel = await backup.channels
                for(var c = 0; c < loadChannel.length; c++) {
                    if(loadChannel[c].type === "text") {
                        text.push(loadChannel.splice(c, 1))
                    } else if(loadChannel[c].type === "voice") {
                        voice.push(loadChannel.splice(c, 1))
                    } else if(loadChannel[c].type === "category") {
                        category.push(loadChannel.splice(c, 1))
                    }
                }

                await category.forEach(ca => {
                    message.guild.createChannel({
                        name: ca.name,
                        type: ca.type,
                        position: ca.position,
                        //permissionOverwrites:
                    })
                })



            }
        })
    }
}*/