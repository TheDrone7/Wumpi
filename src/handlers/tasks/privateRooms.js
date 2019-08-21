const Discord = require("discord.js");
const PrivateroomSchema = require('../../lib/privateRoomsdb.js');
const { Roles } = require('../privateRoomProperties/roles.js');
const { Validate } = require('../privateRoomProperties/validateInput.js');

module.exports = {
    name: 'privateroom',
    description: 'Creates a private room which is customizable',
    aliases: ['room', 'myroom', 'chatroom', 'pr'],
    permissionsRequired: null,
    usage: 'username:role',
    args: true,
    guildOnly: true,
    /**
     * @param client {Discord.Client}
     * @param message {Discord.Message}
     * @param args {String[]}
     * @returns {Promise<Message | Message[]> | *}
     */
    execute(client, message, args) {
      const PrivateRoomCategory = message.guild.channels.find(chan => chan.name.toLowerCase() === "private rooms" && chan.type === "category")
        if(!PrivateRoomCategory)
          return message.channel.send("You can't create a private room here, ask the server owner if he/she could add a `private rooms` category");
        PrivateroomSchema.findOne({userId: message.author.id}, async (err, result) => {
          if(err) return console.error(err);

          if(result) {
            if(message.guild.channels.filter(chan => chan.name.split('-')[1] === message.author.id).array().length > 2) 
              return message.channel.send("You have 2 private rooms already on this guild. Maybe remove one.");

            await InitRoom(client, message, args, result, PrivateRoomCategory);

            PrivateroomSchema.findOneAndUpdate({ userId : message.author.id }, result, (err, updated) => {
              if(err) return console.error(err);
            });
          } else if (!result) {
            await InitRoom(client, message, args, result, PrivateRoomCategory);
          }
        });
    }
};
/**
 * 
 * @param client {Discord.Client}
 * @param message {Discord.Message}
 * @param args {String[]}
 * @param PrivateRoomCategory {Discord.GuildChannel}
 * @param result {Document}
 */
const InitRoom = async (client, message, args, result, PrivateRoomCategory) => {
  if(!args) 
    return message.channel.send("You need to add at least one user!");

  const { Errors, Valid } = Validate(args, message);
  if(Object.keys(Errors).length > 0) 
    return message.channel.send(`Sorry, some errors happened\n` + "```" + JSON.stringify(Errors) + "```");

  Valid.push({
    type: "role",
    deny: ["READ_MESSAGES", "SEND_MESSAGES", "ADD_REACTIONS", "USE_EXTERNAL_EMOJIS"],
    id: message.guild.id
  });
  Valid.push({
    type: "member",
    allow: Roles.owner,
    id: message.author.id
  });

  const privateRooms = message.guild.channels.filter(chan => chan.name.split('-')[1] === message.author.id).array().length;
  const channel = await message.guild.createChannel(`private-${message.author.id}-${!result ? 1 : privateRooms + 1}`, {
    type: "text",
    permissionOverwrites: Valid
  })
  .catch(console.error());

  channel.setParent(PrivateRoomCategory.id)
  .catch(console.error());

  channel.send(`Hey ${message.member}, I created your own channel. Have fun!`)
  .catch(console.error());

  if(!result) {
    const newObj = new PrivateroomSchema({
      userId: message.author.id,
      name: message.author.username,
      rooms: [
        {
          roomId: channel.id,
          roles: Valid
        }
      ]
    });
    newObj.save();
    return;
  }

  result.rooms.push({
    roomId: channel.id,
    roles: Valid
  });
}