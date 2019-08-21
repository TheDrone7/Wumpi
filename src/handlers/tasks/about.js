const Discord = require("discord.js");

module.exports = {
    name: 'about',
    description: 'Displays some about information.',
    cooldown: 30,
    permissionsRequired: ['READ_MESSAGES'],
    aliases: ['aboutme', 'about-me'],
    usage: '[command name]',
    /** Simple about command in embedded message.
     *
     * @param message {String}
     *
     * returns dm {Discord.RichEmbed}
     * */
    execute(client, message, args) {
        let aboutEmbed = new Discord.RichEmbed()
          .setTitle('About Me')
          .setTimestamp(new Date())
          .setColor(0x02f2e6)
          .setThumbnail('https://i.imgur.com/RBF518F.jpg')
          .setDescription("If you want to learn more about 'Wumpi', check out our [Discord](https://discord.gg/fbkygd 'Discord server') or head over to its [Github](https://github.com/alex5219/Wumpi 'Github') to understand it better!")
          .addField("A bit about me", "I always wanted to be more known than Wumpus, because he is just sitting around being cute and so I thought it would be great if I show up with some nice powers to show Wumpus who is actually the better one!")
      
        message.author.send(aboutEmbed)
        .then((msg) => {
          if (message.channel.type === 'dm') return;
          message.channel.send('I sent you a dm!');
        })
        .catch(error => {
          console.error(`Failed to send help DM to ${message.user.username}\n`, error);
          message.reply('I\'m unable to dm you ;(');
        });
    },
};