export default {
  set: `This command is used to modify the types of channels. The valid channel types are
  
  **1. user-only**: Only users can send messages in this channel, any messages sent by bots will be deleted.
  **2. suggestions**: Any messages sent in this channel will be deleted, resent by the bot, with a poll system.
  **3. support**: This has to be a channel category and not a text channel. Setting this will enable support command in your server. Any new support channels will be created under this category.
  **4. ticket-logs**: All logs of opening and closing of support tickets will be sent here.
  **5. join-logs**: All logs of people joining and leaving will be sent here.
  **6. moderator-logs**: All logs of moderator actions will be sent here.
  **7. message-logs**: All logs of message edit/delete will be sent here.
  
  Followed by the channel type, you need to provide the channel which you want to change the settings for.
  
  You can also optionally provide \`--disable\` to remove the setting from the channel.`,

  ban: `This command will ban the user from the server. You can optionally specify a reason. 
  If not specified, the reason defaults to \`No reason\`.
  Notifies the user being banned via DMs if possible.`,

  kick: `This command will ban the kick from the server. You can optionally specify a reason. 
  If not specified, the reason defaults to \`No reason\`.
  Notifies the user being kicked via DMs if possible.`,

  timeout: `This command will timeout the user from the server for the specified amount of time. You can optionally specify a reason.
  If not specified, the time defaults to 5m (5 minutes).
  The provided timing has to be one-word (5minutes) or multiple words in quotes ("5 minutes"). 
  If not specified, the reason defaults to \`No reason\`.
  Notifies the user being timed out via DMs if possible.`,

  lockdown: `This command will initiate a lockdown in the server for a specified amount of time.
  During a lockdown, all channels are locked and only admins can send messages or use voice channels.
  If not specified, the duration defaults to 1h (1 hour).
  The provided timing has to be one-word (1hour) or multiple words in quotes ("1 hour").
  This can optionally be ended earlier, using the \`unlock\` command.
  All channel permissions are restored back to as they were before the lockdown.`,

  help: `This command displays either the list of all commands or the details of the specified command.
  If no command is specified, the list is displayed, if a valid command is specified, it's details are shown.`
};
