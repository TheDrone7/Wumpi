const Discord = require('discord.js');
/**
 * @param result {Document}
 * @param message {Discord.Message}
 * @param args {String[]}
 */
const ValidateRoomSelection = (result, message, args) => {
  var roomsOnGuild = 0;
  result.rooms.forEach(room => {
    var channel = message.guild.channels.find(chan => chan.id === room.roomId);
    if(channel) {
      ++roomsOnGuild;
    }
  });

  if(roomsOnGuild === 0)
    return {
      errorMessage: "You dont have any rooms here!",
      index: 0
    }
  
  if(args[0].split(':')[0].toLowerCase() !== "chat")
    return {
      errorMessage: "You didn't specify what chat you want to use for that action",
      index: 0
    }
  
  const channelSelected = parseInt(args[0].split(':')[1]);
  if(isNaN(channelSelected))
    return {
       errorMessage: "Enter a valid number",
       index: 0
    }

  if(channelSelected > roomsOnGuild || channelSelected < 1)
  return {
    errorMessage: `Enter a number between 1 and ${roomsOnGuild}`,
    index: 0
  }

  return {
    errorMessage: null,
    index: channelSelected
  }
}

module.exports = { ValidateRoomSelection };