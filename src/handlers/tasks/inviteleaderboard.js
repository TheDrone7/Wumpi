const { RichEmbed } = require('discord.js');

module.exports = {
  name: 'inviteleaderboard',
  description: 'See many invites of the guild',
  guildOnly: true,
  cooldown: 20,
  aliases: ['invleaderboard', 'invl'],
  usage: '[command name]',
  execute(client, message, args) {
    message.guild.fetchInvites().then(async (inviteMap) => {
      var invites = await inviteMap.array();
      if(invites.length <= 0) return message.channel.send('Wasnt able to find any invites on this server');
      SendMessage(message, client, invites);
    });
  }
}

function SendMessage(message, client, invites) {
  var LeaderBoards = new Array();
  var TempSave = new Array();
  invites.forEach(invite => {
    TempSave.push({
      username: invite.inviter.username,
      code: invite.code,
      used: invite.uses
    });
  });
  
  FindHighestInviteCount(TempSave, LeaderBoards);
  
  //Create embed
  var embed = new RichEmbed()
  .setTitle('Invite leaderboard')
  .setDescription(`Leaderboard about all invites of this guild only from 1st - ${LeaderBoards.length > 20 ? 20 : LeaderBoards.length}`)
  .setColor('0xffa500')
  .setTimestamp(new Date())
  .setThumbnail(client.user.avatarURL);
  
  console.log(LeaderBoards);
  
  LeaderBoards.forEach((inv, index, arr) => {
    if(index < 20) {
      embed.addField(`#${index + 1}. ${inv.username}`, `Code: ${inv.code}\nUses: ${inv.used}`);
    }
  });
  
  message.channel.send(embed);
}

function FindHighestInviteCount(invites, Leaderboard) {
  
  var highestCount = 0;
  var invite = {};
  var index = 0;
  
  if(invites.length <= 0) return;
  for(var i = 0; i < invites.length; i++) {
    if(invites[i].used >= highestCount) {
      highestCount = invites[i].used;
      invite = invites[i];
      index = i;
    }
  }
  
  Leaderboard.push(invite);
  
  if(invites.length > 0) {
    invites.splice(index, 1);
    FindHighestInviteCount(invites, Leaderboard);
  }
}