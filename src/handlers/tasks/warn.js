const Discord = require("discord.js");
const UserSchema = require('../../lib/usersdb.js');
const ms = require('ms');

module.exports = {
    name: 'warn',
    description: 'Kicks the user and sends a kicked message.',
    aliases: ['w'],
    permissionsRequired: ['MANAGE_CHANNELS'],
    usage: '[command name] @User "Reason"',
    args: true,
    guildOnly: true,
    /**
     * @param message {Discord.Message}
     * @param args {String[]}
     * @param client {Discord.Client}
     * @returns {Promise<Message | Message[]> | *}
     */
    execute(client, message, args) {
        const taggedUser = message.mentions.members.first();
        if(!taggedUser) 
          return message.channel.send('You didnt tag a member of this guild!');
        const reason = args.slice(1).join(" ");
        if(!reason) 
          return message.channel.send('Enter a reason!');
        if(taggedUser.hasPermissions(["MANAGE_CHANNELS"]))
          return message.channel.send("You can't warn that member");
        const taggedUserId = taggedUser.id;

        UserSchema.findOne({ userId: taggedUser.id }, async (err, result) => {
          if(err) return console.error(err);
          if(result) {
            var { warns } = result;
            if(warns.length <= 0) {
              taggedUser.send("You got banned because of `" + reason + "`")
              .catch(console.error());
              warns.push({
                type: `By member - ${message.author.username}`,
                reason: reason
              });
            }
            else if (warns.length === 1) {
              warns.push({
                type: `By member - ${message.author.username}`,
                reason: reason
              });
              var role = message.guild.roles.find(role => role.name === "muted");
              if(!role) {
                role = await message.guild.createRole({
                  name: "muted",
                  permissions: []
                })
                .catch(console.error());
                await message.guild.channels.forEach(channel => {
                  channel.overwritePermissions(taggedUser, {
                    "SEND_MESSAGES": false,
                    "ADD_REACTIONS": false
                  })
                })
              }
              taggedUser.addRole(role)
              .catch(console.error());
              taggedUser.send("You got banned because of `" + reason + "`")
              .catch(console.error());

              setTimeout(() => {
                taggedUser.removeRole(role)
                .catch(console.error());
              }, ms('10m'))
            }
            else if (warns.length === 2) {
              warns.push({
                type: `By member - ${message.author.username}`,
                reason: reason
              });
              taggedUser.send("You got kicked because of `" + reason + "`")
              .catch(console.error());
              taggedUser.kick(reason)
              .catch(console.error());
            }
            else if (warns.length >= 3) {
              warns.push({
                type: `By member - ${message.author.username}`,
                reason: reason
              });
              taggedUser.send("You got banned because of `" + reason + "`")
              .catch(console.error());
              taggedUser.ban(reason)
              .catch(console.error());
            }

            result.warns = warns;
            message.channel.send("Warned user");

            UserSchema.findOneAndUpdate({ userId: taggedUserId }, result, (err, updated) => {
              if(err) return console.error(err);
            })
          }
        })
    }
};