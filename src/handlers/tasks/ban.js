const Discord = require("discord.js");

module.exports = {
    name: 'ban',
    description: 'Bans the user specified with reason.',
    aliases: ['🔨', 'ba', 'bann'],
    permissionsRequired: ['BAN_MEMBERS'],
    usage: '[command name] @User "Reason"',
    args: true,
    guildOnly: true,
    /** Simple ban command with a reason in Embedded form
     *
     * @param args {mentions.users.first} - First argument, if it's a user
     * @param message {String} - Anything after the first argument
     *
     * returns channel message {Discord.RichEmbed}
     * returns dm{Discord.RichEmbed}
     * */
    execute(client, message, args) {
        if (!message.mentions.users.size)
            return message.reply('You need to tag a user to ban them.');
        const taggedUser = message.mentions.users.first();
        if (!taggedUser) return message.channel.send('You didnt tag a user!');
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