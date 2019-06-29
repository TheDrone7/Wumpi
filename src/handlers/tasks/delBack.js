const mongoose = require("mongoose");
const Backup = require('../../lib/backupdb');

module.exports = {
    name: 'deletebackup',
    description: 'Delete a existing backup with your key',
    guildOnly: true,
    permissionsRequired: ['ADMINISTRATOR'],
    cooldown: 25,
    aliases: ['delback', 'delbackup'],
    usage: '"keys"',
    execute(client, message, args) {
        //if (message.author.id !== message.guild.ownerID) return message.channel.send("Your not the owner of this server or you don't have `MANAGE_GUILD` permission")
        Backup.findOne({
            id: message.guild.id,
            authorId: message.author.id,
            key: args[0]
        }, async (err, guild) => {
            if (err) {
                console.log(err)
            }
            if (!guild) {
                return message.channel.send("You don't have any backup in this server! Please check your `key`, `guild` input")
            } else {
                await guild.delete();
                await guild.save();
                let guildFix = client.guilds.find(g => g.id === guild.id);
                await message.channel.send(`Successfully delete you backup on ${guildFix} with key: \`${guild.key}\``)
            }
        })
    }
};