const { RichEmbed } = require('discord.js');
const leaderboard = require('./inviteleaderboard.js');

module.exports = {
  name: 'invites',
  description: 'See invites of a certain user',
  guildOnly: true,
  cooldown: 10,
  aliases: ['checkinvites'],
  usage: '[command name]',
  execute(client, message, args) {
    let toCheck = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if (!toCheck) return message.reply("Missing arguments! `-invites 'user'`");
    
    var totalInvites = 0;
    var UserInvites = new Array();
    message.guild.fetchInvites().then(inviteMap => {
      inviteMap.forEach(invite => {
        if(invite.inviter.id === toCheck.user.id) {
          totalInvites += invite.uses;
          UserInvites.push({
            code: invite.code,
            used: invite.uses
          });
        }
      });
      if(UserInvites.length <= 0) return leaderboard.execute(client, message, args);

      var embed = new RichEmbed()
      .setTitle('User invites')
      .setAuthor(client.user.username)
      .setDescription(`${toCheck.user.username} has invited ${totalInvites} users`)
      .setTimestamp(new Date())
      .setThumbnail(toCheck.user.avatarURL)
      .setColor('0xffa500')

      UserInvites.forEach((invite, index, arr) => {
        if(index < 25) {
          embed.addField(invite.code, `This invite code has ${invite.used} uses`)
        }
      });
      message.channel.send(embed);
    });
  }
}