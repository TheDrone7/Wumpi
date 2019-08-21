const Discord = require("discord.js");
const PollSchema = require('../../lib/polldb.js');

module.exports = {
    name: 'poll',
    description: 'creates a poll',
    aliases: [],
    permissionsRequired: ['MANAGE_CHANNELS'],
    usage: 'None',
    args: false,
    guildOnly: true,
    /**
     * 
     * @param client {Discord.Client}
     * @param message {Discord.Message}
     * @param args {String[]}
     */
    async execute(client, message, args) {
        const filter = (msg) => msg.author.id === message.author.id && msg.channel.id === message.channel.id;
        const collector = new Discord.MessageCollector(message.channel, filter, { time: 90000 });

        const Poll = {
          Channel: null,
          Title: null,
          Description: null,
          Fields: null,
          Emojis: null,
          Date: null,
          FieldCount: 0
        }

        message.channel.send("Enter a channel id|name");
        
        collector.on("collect", (msg, collectedMessages) => {
          const content = msg.content;
          if(!Poll.Channel) {
            var channel = msg.guild.channels.find(chan => chan.id === content);
            if(!channel) {
              channel = msg.guild.channels.find(chan => chan.name === content);
              if(!channel) 
                return msg.channel.send("Wasn't able to find that channel");
              Poll.Channel = channel;
            }
            Poll.Channel = channel;
            msg.channel.send("Enter a title");
          }
          else if (!Poll.Title) {
            Poll.Title = content;
            msg.channel.send("Enter a description");
          }
          else if (!Poll.Description) {
            Poll.Description = content;
            msg.channel.send("Enter how many options you want to have");
          }
          else if(!Poll.Fields) {
            const count = parseInt(content);
            if(isNaN(count))
              return msg.channel.send("The count you entered wasn't a valid number");
            if(count < 2 || count > 4)
              return msg.channel.send("The count must be between 2 and 4");
            Poll.Fields = new Array(count);
            Poll.Emojis = new Array(count);
            msg.channel.send(`Enter your ${Poll.FieldCount + 1} field`);
          }
          else if(!Poll.Fields[Poll.FieldCount]) {
            if(Poll.Fields.includes(content))
              return msg.channel.send("Don't use the same option!");

            Poll.Fields[Poll.FieldCount] = content;
            msg.channel.send(`Enter your ${Poll.FieldCount + 1} emoji`);
          }
          else if (!Poll.Emojis[Poll.FieldCount]) {
            if(Poll.Emojis.includes(content))
              return msg.channel.send("You cant use the same emoji");

            Poll.Emojis[Poll.FieldCount] = content;
            if(Poll.FieldCount + 1 < Poll.Emojis.length) {
              ++Poll.FieldCount;
              msg.channel.send(`Enter your ${Poll.FieldCount + 1} field`);
            }
            else {
              const date = new Date();
              msg.channel.send("Enter a valid Date, when this poll should be closed!\nExample: `" + `${date.getHours()}/${date.getDate()}/${date.getMonth() + 1}` + "`\nFormat: `hour/day/month`");
            }
          }
          else if (!Poll.Date) {
            const date = new Date();
            const args = content.split('/');
            if(args.length < 3 || args.length > 3) 
              return msg.channel.send("You need to enter 3 values!");
            const hour = parseInt(args[0]);
            if(isNaN(hour))
              return msg.channel.send("Your hour wasn't a number!");
            if(hour > 23 || hour < 0) 
              return msg.channel.send("0 - 23");
            const day = parseInt(args[1]);
            const month = parseInt(args[2]) - 1;
            if(isNaN(day)) 
              return msg.channel.send("Your day wasn't a number");
            if(isNaN(month))
              return msg.channel.send("Your month wasn't a number");
            if(month < 0 || month > 11)
              return msg.channel.send("Wrong month provided");
            if(day <= 0 || day > new Date(date.getFullYear(), month, 0).getDate())
              return msg.channel.send("Wrong day provided");

            const embed = new Discord.RichEmbed()
            .setAuthor(msg.author.username, msg.author.avatarURL)
            .setDescription(Poll.Description)
            .setTitle(Poll.Title)
            .setColor("0xffa500")
            .setThumbnail(client.user.avatarURL);
            
            Poll.Fields.forEach((field, index) => {
              embed.addField(`${index + 1}. Option`, field);
            });

            Poll.Channel.send(embed)
            .then((_msg) => {
              Poll.Emojis.forEach((emoji => {
                _msg.react(emoji)
                .catch(console.error());
              }))

              PollSchema.findOne({ guildId: message.guild.id }, (err, result) => {
                if(err) return console.error(err);
                if(!result) {
                  const newPoll = new PollSchema({
                    guildId: message.guild.id,
                    polls: [{
                      channelid: Poll.Channel.id,
                      pollid: _msg.id,
                      date: `${args[0]}/${args[1]}/${args[2]}`
                    }]
                  });
                  newPoll.save();
                }
                else if (result) {
                  result.polls.push({
                    channelid: Poll.Channel.id,
                    pollid: _msg.id,
                    date: `${args[0]}/${args[1]}/${args[2]}`
                  });

                  PollSchema.findOneAndUpdate({ guildId: message.guild.id }, result, (err, updated) => {
                    if(err) return console.error(err);
                  })
                }

                collector.stop();
              });
            })
            .catch(console.error());
          }
        });

        collector.on("end", (collectedMessages) => {
          console.log("End");
        });
    }
};