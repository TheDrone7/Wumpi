const Discord = require("discord.js");

module.exports = {
    name: 'kick',
    description: 'Kicks the user and sends a kicked message.',
    aliases: ['👢', 'kic', 'remove'],
    permissionsRequired: ['KICK_MEMBERS'],
    usage: '[command name] @User "Reason"',
    args: true,
    guildOnly: true,
    /**
     * @param message
     * @param args
     * @returns {Promise<Message | Message[]> | *}
     */
    execute(client, message, args) {
        if (!message.mentions.users.size) {
            return message.reply('You need to tag a user to kick them.');
        }
        const taggedUser = message.mentions.users.first();
        if (!taggedUser) return message.channel.send('You didnt tag a user!');
        const reason = args.slice(1).join(" ");
        let kickEmbed = new Discord.RichEmbed()
            .setTimestamp()
            .setColor(0xfc0a2e)
            .setTitle('Player Kicked - ' + taggedUser.username)
            .setThumbnail('https://i.imgur.com/RBF518F.jpg')
            .setDescription("Kicked from " + message.channel.guild.name + '\n\n' + "Reason: " + reason + '\n\n')
            .setFooter(message.author.username);
        message.guild.member(taggedUser).kick(reason).catch();
        message.channel.send(kickEmbed).catch();
        taggedUser.send(kickEmbed).catch();
    }
};