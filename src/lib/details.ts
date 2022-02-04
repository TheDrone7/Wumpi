export default {
  set: `This command is used to modify the types of channels and the support message. The valid channel types are
  
  **1. user-only**: Only users can send messages in this channel, any messages sent by bots will be deleted.
  
  **1. bot-only**: Bot commands will only work in this channel, will mention the user to use this channel in this channel if they attempted to use a command elsewhere.
  
  **2. suggestions**: Any messages sent in this channel will be deleted, resent by the bot, with a poll system.
  
  **3. support**: This has to be a channel category and not a text channel. Setting this will enable support commands in your server. Any new support channels will be created under this category.
  
  **4. support-message:** This message will be sent when a new support ticket is created in the newly created channel for the ticket.
  
  **5. ticket-logs**: All logs of opening and closing of support tickets will be sent here.
  
  **6. join-logs**: All logs of people joining and leaving will be sent here.
  
  **7. moderator-logs**: All logs of moderator actions will be sent here.
  
  **8. message-logs**: All logs of message edit/delete will be sent here.
  
  Followed by the channel type, you need to provide the channel which you want to change the settings for.
  
  You can also optionally provide \`--disable\` to remove the setting from the channel.`,

  ban: `This command will ban the user from the server. You can optionally specify a reason. 
  If not specified, the reason defaults to \`No reason\`.
  Notifies the user being banned via DMs if possible.`,

  kick: `This command will kick the user from the server. You can optionally specify a reason. 
  If not specified, the reason defaults to \`No reason\`.
  Notifies the user being kicked via DMs if possible.`,

  warn: `This command enables you to manage a user's warnings.
  The first you need to specify if you want to "add", "remove" or "show" warnings.
  
  When adding a warning, you need to additionally specify the user you want to warn and optionally a reason. 
  If not specified, the reason defaults to \`No reason\`.
  Notifies the user being warned via DMs if possible.
  
  When deleting a warning, the warning's ID has to be specified that needs to be deleted.
  All warnings have unique IDs even if they were for different people or even different servers.
  You can only remove a warning from a server you have sufficient permissions in.
  
  When viewing a user's warnings, you need to provide the user whose warnings need to be shown.`,

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
  If no command is specified, the list is displayed, if a valid command is specified, it's details are shown.`,

  note: `This command enables you to manage a user's notes.
  The first you need to specify if you want to "add", "remove" or "show" notes.
  
  When adding a note, you need to additionally specify the user you want to add a note to followed by the note itself. 
  If not specified, the note defaults to \`No note\`.
  Does NOT notify the user.
  
  When deleting a note, the note's ID has to be specified that needs to be deleted.
  All notes have unique IDs even if they were for different people or even different servers.
  You can only remove a note from a server you have sufficient permissions in.
  
  When viewing a user's notes, you need to provide the user whose notes need to be shown.`,
  blacklist: `This command enables you to manage blacklisted words in your server.
  If a user uses a blacklisted word in a message, their message is deleted and they are sent a warning.
  If the user has the staff role, they can bypass this check and use blacklisted words regardless.
  
  When adding/removing a word to/from the blacklist, the word being added/removed has to be specified.
  You can also view the current list of blacklisted words if you're unsure of what words are banned and what are allowed.`,
  ignore: `This command can be used to make the bot ignore specific channels for specific automod checks.
  
  You can ignore \`blacklist\`, \`spam\`, \`invites\`, and \`ratelimit\` checks in any channel you specify.
  
  If you \`enable\`, the bot will ignore the specified check in the specified channel.
  If you \`disable\` the bot will perform the specified check in the specified channel.
  
  By default, all checks are performed in all channels.`,
  ratelimit: `This command allows you to control the message rate limit by the users.
  You can set the count to a number, such as 5, 10, etc.
  And you can set the duration to some amount of time such as 2m.
  The provided timing has to be one-word (5minutes) or multiple words in quotes ("5 minutes").
  
  To explain how this works, lets assume the count is \`5\` and the duration is \`1 minute\`.
  Then, if a user sends more than 5 messages in 1 minute, they will be muted/timed out for \`1 hour\` and warned.
  
  This is NOT channel-specific, this enforces the rate limit all over the server.
  
  To disable this check, run the command but do not provide any value for the amount.`,
  staff: `This command is used to update the staff role.
  People with the staff role can bypass automod.
  
  For using the moderation commands however, they would still need the right permissions for each command.`,
  spam: `This command allows you to control the amount of emojis and repeated words allowed in a message in your server.
  You can set the count to a number, such as 5, 10, etc.
  
  If the user uses more emojis in a message than the specified amount, their message will be deleted and they will be warned.
  As for the spam limit,
  If the user uses the same word OR character more than the specified number of times, their message will be deleted and they will be warned.
  
  For example, if the word count is set to 5
  AAAAA will be allowed but AAAAAA will not be allowed, similarly
  xd xd xd xd xd will be allowed but xd xd xd xd xd xd will not be allowed.
  aaaaaaaaaaaaaaaaaaaaaaaaaaaaa will be allowed.
  
  The repeated characters check is only applicable to uppercase letters.
  To disable this check, run the command but do not provide any value for the amount.`,
  welcome: ``
};
