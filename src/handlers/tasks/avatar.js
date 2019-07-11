//    console.log(member.avatarURL === member.defaultAvatarURL)
const Discord = require("discord.js");

module.exports = {
    name: 'avatar',
    description: 'Retrieve the profile picture URL of a user',
    aliases: ['ava', 'pfp', 'profile'],
    permissionsRequired: ['READ_MESSAGES'],
    usage: '[command name] @User',
    args: true,
    guildOnly: true,
    execute(client, message, args) {
        const taggedUser = message.mentions.users.first();
        if (!taggedUser) return;
        message.author.send(taggedUser.avatarURL);
    }
};