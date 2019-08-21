const Discord = require('discord.js');
const client = require('../wumpi.js');
const PollSchema = require('../lib/polldb.js');

/**
 * Called whenever a reaction is added to a message.
 * 
 */
client.on('messageReactionAdd', (reaction, user) => {
    if(user) {
        if(user.bot)
            return;
        GetPoll(reaction, user);
    }
});

/**
 * @param reaction {Discord.MessageReaction}
 * @param user {Discord.User}
 */
const GetPoll = (reaction, user) => {
    PollSchema.findOne({ guildId: reaction.message.guild.id }, async (err, result) => {
        if(err) return console.error(err);
        if(result) {
            const poll = result.polls.find(_poll => _poll.pollid === reaction.message.id);
            if(!poll) 
                return;
          
            var allUsers = new Array();

            reaction.message.reactions.forEach(react => {
                react.users.forEach(user => {
                    allUsers.push({
                        userid: user.id,
                        emoji: react.emoji.name
                    })
                })
            })

            if(allUsers.filter(u => u.userid === user.id).length >= 2) {
                reaction.remove(user).catch(console.error());
            }

            const allReactions = reaction.message.reactions.map(users => {
                return users.users.filter(user => !user.bot).array().length;
            });

            const newStats = CalculateStats(allReactions);

            const info = {
                Title: reaction.message.embeds[0].title,
                Description: reaction.message.embeds[0].description,
                Fields: reaction.message.embeds[0].fields
            }

            const author = reaction.message.embeds[0].author;
            reaction.message.edit(CreateEmbed(newStats, info, client, author))
            .catch(console.error());
        }
    })
}

/**
 * 
 * @param votes {number[]}
 */
const CalculateStats = (votes) => {
    var sum = 0;
    votes.forEach(vote => sum += vote);

    var votedCount = new Array();
    votes.forEach((vote) => {
        votedCount.push(vote);
    })

    return votes.map((vote, index) => {
        return (vote * 100) / (sum <= 0 ? 1 : sum);
    });
}

/**
 * 
 * @param stats {number[]} 
 * @param poll {{Title: String, Description: String, Fields: Discord.MessageEmbedField[], Emojis: String[]}}
 * @param author {Discord.MessageEmbedAuthor}
 * @param client {Discord.Client}
 */
const CreateEmbed = (stats, poll, client, author) => {
    const embed = new Discord.RichEmbed()
    .setAuthor(author.name, author.url)
    .setThumbnail(client.user.avatarURL)
    .setTitle(poll.Title)
    .setDescription(poll.Description)
    .setColor("0xffa500");

    poll.Fields.forEach((field, index, arr) => {
        var newValue = field.value.split('\n')[0] + `\n_Voted by ${stats[index]}%_`
        embed.addField(`${index + 1}. Option`, newValue);
    })

    return embed;
}

client.on('messageReactionRemove', (reaction, user) => {
    if(user) {
        if(user.bot)
            return;
        GetPoll(reaction, user);
    }
});