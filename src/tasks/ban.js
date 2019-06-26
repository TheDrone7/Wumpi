const Discord = require("discord.js");

module.exports = {
    name: 'ban',
    description: 'Bans the user specified with reason.',
    aliases: ['🔨', 'ba', 'bann'],
    permissionsRequired: ['BAN_MEMBERS'],
    usage: '[command name] @User "Reason"',
    args: true,
    guildOnly: true,
    execute(message, args) {
        if (!message.mentions.users.size) {
            return message.reply('You need to tag a user to ban them.');
        }
        const taggedUser = message.mentions.users.first();
        const reason = args.slice(1).join(" ");
        let banEmbed = new Discord.RichEmbed()
            .setTimestamp()
            .setColor(0xfc0a2e)
            .setTitle('Player Banned - ' + taggedUser.username)
            .setThumbnail('https://i.imgur.com/RBF518F.jpg')
            .setDescription("Banned from " + message.channel.guild.name + '\n\n' + "Reason: " + reason + '\n\n')
            .setFooter(message.author.username);
        message.guild.member(taggedUser).ban(reason).catch();
        message.channel.send(banEmbed).catch();
        taggedUser.send(banEmbed).catch();
    }
};