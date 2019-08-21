const Discord = require('discord.js');
const client = require('../wumpi.js');
const botUsers = require('../lib/botUsers');
const emojiCharacters = require('../lib/emojiCharacters');
const guildSettings = require('../lib/guilddb');

client.on('guildMemberAdd', member => {
    
  guildSettings.findOne({id: member.guild.id}, (err, guild) => {
    if(err) return console.log(err);
    if(guild.values.isAntiBotEnabled) {
      botUsers.findOne({ userID: member.id }, (err, result) => {
        if(err) return console.error(err);
        if(!result) {
          checkProfile(member);
        } else if (!result.checked) {
          checkProfile(member);
        }
      })
    }
  });
});

/**
 * 
 * @param member {Discord.GuildMember}
 */
const checkProfile = (member) => {
  if (member.user.avatarURL === member.user.defaultAvatarURL) {
    captcha(member);
    return;
  }
  let a = member.user.username;
  if (a.includes('1') || a.includes('2') || a.includes('3') || a.includes('4') || a.includes('5') || a.includes('6') || a.includes('7') || a.includes('8') || a.includes('9') || a.includes('0')) {
    captcha(member);
    return;
  }
  let d = new Date();
  d.setDate(d.getDate() - 90);
  if (member.user.createdAt.getUTCDate() > d) {
    captcha(member);
    return;
  }
}

const captcha = (member) => {
  let blockedUserRole = member.guild.roles.find(r => r.name === "notverified");
  if (blockedUserRole) {
    member.addRole(blockedUserRole).then((role) => console.log('Added role')).catch(e => console.log(e));
    member.guild.channels.forEach(c => {
      c.overwritePermissions(blockedUserRole, {
        "READ_MESSAGES": false,
        "SEND_MESSAGES": false,
        "ADD_REACTIONS": false
      }).catch(e => console.log(e));
    });
  } else {
      member.guild.createRole({
        name: "notverified"
      }).then(role => {
        member.addRole(role).then((_role) => {
          console.log('Added Role');
        });
        member.guild.channels.forEach(c => {
          c.overwritePermissions(role, {
            "READ_MESSAGES": false,
            "SEND_MESSAGES": false,
            "ADD_REACTIONS": false
        }).catch(e => console.log(e));
      });
    });
  }
  let a = (Math.floor((Math.random() * 9) + 1));
  let b = (Math.floor((Math.random() * 9) + 1));
  let c = (Math.floor((Math.random() * 9) + 1));
  let d = (Math.floor((Math.random() * 9) + 1));
  let code = a.toString() + b.toString() + c.toString() + d.toString();
  let captchaEmbed = new Discord.RichEmbed()
    .setTitle('CAPTCHA')
    .setTimestamp(new Date())
    .setColor('0xfc4705')
    .setThumbnail(member.user.avatarURL)
    .setFooter(member.guild.name)
    .setDescription(
    'Hello '
    + member.user.username
    + ', \n\n'
    + 'Your account has been flagged by our auto-moderation.'
    + '\n\n'
    + 'Please reply to this message with the following:'
    + '\n'
    + emojiCharacters[a] + emojiCharacters[b] + emojiCharacters[c] + emojiCharacters[d]);
  
  member.send("loading...").then((msg) => {
    msg.edit(captchaEmbed)
    .catch(e => console.log(e));
    botUsers.findOne({userID: member.id}, (err, user) => {
      if (!user) {
        const newbotUsers = new botUsers({
          userID: member.id,
          username: member.name,
          code: code,
          checked: false,
          isBot: false,
          isSus: true,
          guildId: member.guild.id
        });
        newbotUsers.save();
        
      } else if(!user.checked) {

        user.userID = member.id;
        user.code = code;
        user.checked = false;
        user.isSus = true;
        user.guildId = member.guild.id;
        botUsers.findOneAndUpdate({userID: member.id}, user, (err) => {
          if(err) throw err;
        });
      }
    }).catch(error => {
      console.error(`Failed to send help DM to ${member.user.username}.\n`, error);
    });
  }).catch(e => console.log(e));
}