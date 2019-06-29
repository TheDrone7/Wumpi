const ms = require("ms");
const mongoose = require("mongoose");
const Mute = require('../../lib/mute');

module.exports = {
    name: 'tempmute',
    description: 'Temporaly mute a user in your guild',
    guildOnly: true,
    cooldown: 10,
    permissionsRequired: ['MANAGE_CHANNELS'],
    aliases: ['tmute', 'tm'],
    args: true,
    usage: '"user" "duration" "reason"',
    execute(client, message, args) {
        let toMute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if (!toMute) return message.reply("Missing arguments! `-tempmute 'user' 'duration' 'reason'`");

        if (toMute.hasPermission("MANAGE_CHANNELS")) return message.reply(`Can't mute ${toMute.user.toString()}`);

        let muteRole = message.guild.roles.find(r => r.name === "muted");
        if (!muteRole) {
            try {
                muteRole = message.guild.createRole({
                    name: "muted",
                    color: "#000000",
                    permissions: []
                });
                message.guild.channels.forEach(async (channel) => {
                    await channel.overwritePermissions(muteRole, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false
                    });
                });
            } catch (e) {
                console.log(e.stack);
            }
        }

        let mutetime = args[1];
        if (!mutetime) return message.reply("You didn't specify a time!");
        if (isNaN(ms(mutetime))) return message.reply("Your duration input isn't a number");

        let reason = args[2];
        if (!reason) return message.reply("You didn't specify a reason");

        Mute.findOne({
            guildId: message.guild.id
        }, async (err, mute) => {
            if (err) {
                console.log(err)
            }

            if (!mute) {
                let newMute = new Mute({
                    guildId: message.guild.id,
                    records: [
                        [{
                            mutedId: toMute.user.id,
                            muted: toMute.user.username,
                            id: message.author.id,
                            name: message.author.username,
                            end: parseInt(Date.now() + ms(mutetime)),
                            reason: reason
                        }]
                    ]
                });

                newMute.save().then(async () => {
                    await toMute.addRole(muteRole.id);
                    await setTimeout(async () => {
                        await toMute.removeRole(muteRole.id)
                    }, ms(mutetime));

                })
            } else {
                //console.log("it continues")
                let reports = mute.records;
                //console.log(reports)
                for (var i = 0; i < reports.length; i++) {
                    //console.log(i)
                    //console.log(reports[i])
                    //console.log(reports[i][0])
                    if (reports[i][0].mutedId == toMute.user.id) {
                        //console.log("get user")
                        if (reports[i][0].end - Date.now() > 0) {
                            console.log((reports[i][0].end - Date.now() > 0) === false);
                            return message.channel.send("This user still have an active mute!")
                        }
                    }
                }

                reports.push([{
                    mutedId: toMute.user.id,
                    muted: toMute.user.username,
                    id: message.author.id,
                    name: message.author.username,
                    end: parseInt(Date.now() + ms(mutetime)),
                    reason: reason
                }]);

                mute.save().then(async () => {
                    await toMute.addRole(muteRole.id);
                    await setTimeout(async () => {
                        await toMute.removeRole(muteRole.id)
                    }, ms(mutetime))
                })
            }
        })
    }
};