const ms = require("ms");
const mongoose = require("mongoose");
const Mute = require('../../lib/mute');
const Discord = require('discord.js');

module.exports = {
    name: 'tempmute',
    description: 'Temporaly mute a user in your guild',
    guildOnly: true,
    cooldown: 10,
    permissionsRequired: ['MANAGE_CHANNELS'],
    aliases: ['tmute', 'tm'],
    args: true,
    usage: '@user "duration" "reason"',
    /**
     * 
     * @param client {Discord.Client}
     * @param message {Discord.Message}
     * @param args {String[]}
     */
    async execute(client, message, args) {
        let toMute = message.guild.member(message.mentions.members.first());

        if (!toMute) 
          return message.channel.send("Missing arguments! `-tempmute 'user' 'duration' 'reason'`");

        if (toMute.hasPermission("MANAGE_CHANNELS")) 
          return message.channel.send(`Can't mute ${toMute.user.username}, because that user counts to high permissions users`);

        let muteRole = message.guild.roles.find(r => r.name === "muted");
        if (!muteRole) {
            muteRole = await message.guild.createRole({
                name: "muted",
                color: "#000000",
                permissions: []
            }).catch(e => { return console.log(e); })
            message.guild.channels.forEach(async (channel) => {
                await channel.overwritePermissions(muteRole, {
                    "SEND_MESSAGES": false,
                    "ADD_REACTIONS": false
                }).catch(e => { return console.log(e); })
            });
        }

        let mutetime = args[1];
        if (!mutetime) return message.reply("You didn't specify a time!");
        if(!mutetime.includes('s') && !mutetime.includes('h') && !mutetime.includes('m'))
            return message.channel.send("Your time must end with a 's', 'm' or 'h'\nExample: `35m`");
        
        let reason = args.splice(1, 2).join(" ");
        if (!reason) return message.reply("You didn't specify a reason");
      
        toMute.send(`You got muted because ` + reason)
        .catch(console.error());
      
        message.channel.send(`Muted user ${toMute.user.username} for ${mutetime} because of ${reason}`);

        toMute.addRole(muteRole)
        .catch(console.error());
        setTimeout(() => {
            toMute.removeRole(muteRole)
            .catch(console.error());
        }, ms(mutetime))

    }
};