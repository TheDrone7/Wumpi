const Discord = require("discord.js");

module.exports = {
    name: 'about',
    description: 'Displays some about information.',
    cooldown: 30,
    aliases: ['aboutme', 'about-me'],
    usage: '[command name]',
    execute(message) {
        let aboutEmbed = new Discord.RichEmbed()
            .setTitle('About Me')
            .setTimestamp()
            .setColor(0x02f2e6)
            .setThumbnail('https://i.imgur.com/RBF518F.jpg')
            .setDescription('Moderation bot');

        return message.author.send(aboutEmbed)
            .then(() => {
                if (message.channel.type === 'dm') return;
                message.reply('I sent you a dm!');
                message.delete(2000);
            })
            .catch(error => {
                console.error(`Failed to send help DM to ${message.author.tag}.\n`, error);
                message.reply('I\'m unable to dm you ;(');
            });
    },
};