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
        Backup.findOne({ id: message.guild.id, key: args[0] }, async (err, guild) => {
            if (err) return console.error(err);
            if (!guild) {
                return message.channel.send("You don't have any backup in this server! Please check your `key`, `guild` input")
            } else if (guild) {
                Backup.findOneAndRemove({id: message.guild.id}, (err, res) => {
                    if(err) return console.error(err);
                });
                await message.channel.send(`Successfully delete you backup on ${message.guild.name} with key: \`${guild.key}\``)
            }
        })
    }
};