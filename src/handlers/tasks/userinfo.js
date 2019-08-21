const Discord = require("discord.js");
const RankSchema = require("../../lib/usersdb.js");

module.exports = {
    name: 'uinfo',
    description: 'Kicks the user and sends a kicked message.',
    aliases: ['info', 'ui'],
    permissionsRequired: null,
    usage: 'None',
    args: false,
    guildOnly: true,
    /**
     * @param message {Discord.Message}
     * @param args {String[]}
     * @param client {Discord.Client}
     * @returns {Promise<Message | Message[]> | *}
     */
    execute(client, message, args) {
      var mentionedUser = message.mentions.members.first();
      if(!mentionedUser)
        mentionedUser = message.member;

      RankSchema.findOne({ userId: mentionedUser.id }, (err, result) => {
        if(err) return console.error(err);
        if(result) {
          const embed = new Discord.RichEmbed()
          .setAuthor(message.author.username, message.author.avatarURL)
          .setThumbnail(mentionedUser.user.avatarURL)
          .setTitle(`User info of ${mentionedUser.user.username}`)
          .setDescription("Overview of a selected member/yourself")
          .setColor("0xffa500")
          .addField("Basic member info", 
          `Username: ${mentionedUser.user.username}\nNickname: ${mentionedUser.nickname ? mentionedUser.nickname : mentionedUser.user.username}\nRoles:\n ${mentionedUser.roles.filter(role => role.name !== "@everyone").map(role => "`" + role.name + "`").join('\n')}\nJoined At: ${mentionedUser.joinedAt}`
          )
          .addField("Warns", `${result.warns.length <= 0 ? "This user received no warns" : result.warns.map(warn => {
            return `Warn type: ${warn.type}\nWarn reason: ${warn.reason}`;
          })}`)
          .addField("Rank", 
          `Current level: ${result.rank.level}\nCurrent xp: ${result.rank.xp}\nRequired xp: ${(result.rank.level * 250) * result.rank.level}`);

          message.channel.send(embed)
          .catch(console.error());

        }
      })
    }
};