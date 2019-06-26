const Discord = require("discord.js");

module.exports = {
    name: 'mute',
    description: 'Prevents the user from talking in the channel until unmuted.',
    aliases: ['nochat'],
    permissionsRequired: ['MUTE_MEMBERS'],
    usage: '[command name] @User "Reason"',
    args: true,
    guildOnly: true,
    execute(message, args) {
        if (!message.mentions.users.size) {
            return message.reply('You need to tag a user to mute them.');
        }
        const taggedUser = message.mentions.users.first();
        const reason = args.slice(1).join(" ");
        let muteEmbed = new Discord.RichEmbed()
            .setTimestamp()
            .setColor(0xfc0a2e)
            .setTitle('Player Muted - ' + taggedUser.username)
            .setThumbnail('https://i.imgur.com/RBF518F.jpg')
            .setDescription("Muted from " + message.channel.guild.name + '\n\n' + "Reason: " + reason + '\n\n')
            .setFooter(message.author.username);
        message.guild.member(taggedUser).ban(reason).catch();
        message.guild.createRole({name: 'Muted'});

        if (message.guild.roles)

            message.channel.send(muteEmbed).catch();
        taggedUser.send(muteEmbed).catch();
    }
};