const Discord = require('discord.js');
const RankSchema = require('../lib/usersdb.js');

/**
 * @param message {Discord.Message}
 */
const AddXP = (message) => {

  RankSchema.findOne({ userId: message.author.id }, (err, result) => {
    if(err) return console.error(err);
    if(!result) {
      const newRank = new RankSchema({
        userId: message.author.id,
        name: message.author.username,
        warns: new Array(),
        rank: {
          level: 1,
          xp: 0
        }
      });
      newRank.save();
    }
    else if (result) {
      const { content } = message;
      if(content.length >= 200) return;
      if(content.length <= 3) return;

      var { level, xp } = result.rank;
      const newXP = Math.floor(Math.random() * (content.length - 3));
      
      const requiredXP = (level * 250) * level;

      if((xp + newXP) > requiredXP) 
      {
        ++level;
        result.rank.level = level;
        result.rank.xp = (xp + newXP) - requiredXP;
        message.channel.send(`Hey ${message.author.username}, you became level ${result.rank.level}`);
        Reward(level, message);
      }
      else 
      {
        result.rank.xp = (xp + newXP);
      }

      RankSchema.findOneAndUpdate({ userId: message.author.id }, result, (err, updated) => {
        if(err) return console.error(err);
      });
    }
  });
}

/**
 * @param level {Number}
 * @param message {Discord.Message}
 */
const Reward = async (level, message) => {
  var channel = message.guild.channels.find(chan => chan.name === "chat" && chan.parentID);
  if(!channel) {
    const category = await message.guild.createChannel("Rewards", {
      type: "category",
      permissionOverwrites: [{
        type: "role",
        deny: ["ADD_REACTIONS", "READ_MESSAGES", "SEND_MESSAGES"],
        id: message.guild.id
      }],
      topic: "This channel is made by Wumpi, basically its a small reward for any active user who texts often"
    });
    channel = await message.guild.createChannel("chat", {
      type: "text",
      parent: category
    });
    await channel.setParent(message.guild.channels.find(chan => chan.name === "Rewards" && chan.type === "category"));
    await channel.lockPermissions();
  }

  if(level === 25) 
  {
    var role = message.guild.roles.find(roles => roles.name === "level 25");
    if(!role) {
      role = await message.guild.createRole({
        name: "level 25",
      })
      role.edit({
        position: message.guild.roles.length - 2
      })
      .catch(console.error());
    }

    message.member.addRole(role)
    .catch(console.error());

    channel.overwritePermissions(message.author, {
      "READ_MESSAGES": true,
      "ADD_REACTIONS": true,
      "SEND_MESSAGES": true
    })
    .then(() => {
      channel.send(`Hey ${message.member}, you just received your first reward. You got access to this channel!`);
    })
    .catch(console.error());
  } 
  else if (level === 50) 
  {
    var role = message.guild.roles.find(roles => roles.name === "level 50");
    if(!role) {
      role = await message.guild.createRole({
        name: "level 50"
      });
      role.edit({
        position: message.guild.roles.length - 2
      })
      .catch(console.error());
    }

    message.member.addRole(role)
    .catch(console.error());

    channel.overwritePermissions(message.author, {
      "MANAGE_MESSAGES": true
    })
    .then(() => {
      channel.send(`Hey ${message.member}, you can now delete messages here`);
    })
    .catch(console.error());

  } 
  else if (level === 100)
  {
    var role = message.guild.roles.find(roles => roles.name === "level 100");
    if(!role) {
      role = await message.guild.createRole({
        name: "level 100"
      })
      role.edit({
        position: message.guild.roles.length - 2
      })
      .catch(console.error());
    }

    message.member.addRole(role)
    .catch(console.error());
  }
}

module.exports = { AddXP };