const Discord = require("discord.js");

module.exports = {
    name: 'check',
    guildOnly: true,
    execute(message, args) {
        if (message.author.avatarURL === message.author.defaultAvatarURL) {
            message.reply('true')
        } else {
            message.reply('false')
        }
        let a = message.author.username.toString();
        if (a.includes('1') || a.includes('2') || a.includes('3') || a.includes('4') || a.includes('5') || a.includes('6') || a.includes('7') || a.includes('8') || a.includes('9') || a.includes('0')) {
            message.reply('true')
        } else {
            message.reply('false')
        }
        let d = new Date();
        d.setDate(d.getDate() - 90);
        if (message.author.createdAt.getUTCDate() > d) {
            message.reply('true')
        } else {
            message.reply('false')
        }
    }
};