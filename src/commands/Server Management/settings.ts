import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import {
  setChannelType,
  removeChannelType,
  setSupportCategory,
  disableLogs,
  setTicketLogs,
  setJoinLogs,
  setMessageLogs,
  setModeratorLogs
} from '../../database/';
import details from '../../lib/details';

@ApplyOptions<CommandOptions>({
  name: 'set',
  description: 'Modify the admin settings in your server!',
  category: 'Server Management',
  runIn: 'GUILD_ANY',
  cooldownDelay: 10_000,
  syntax: '<channel-type> [--disable] <channel>',
  detailedDescription: details.set,
  requiredUserPermissions: ['ADMINISTRATOR']
})
export class SettingsCommand extends Command {
  public async messageRun(message: Message, args: Args) {
    const kind = (await args.pick('string')).toLowerCase().trim();
    const disable = args.getFlags('disable');
    const channel = await args.pick('channel');

    if (!kind || !channel)
      return message.reply(
        `Please provide the channel type and the channel. Use \`${this.container.client.fetchPrefix(
          message
        )}help set\` to learn more`
      );

    try {
      if (kind === 'user-only')
        if (disable)
          await removeChannelType(channel.id, message.guild!.id, 'user');
        else await setChannelType(channel.id, message.guild!.id, 'user');

      if (kind === 'suggestions')
        if (disable)
          await removeChannelType(channel.id, message.guild!.id, 'suggestions');
        else await setChannelType(channel.id, message.guild!.id, 'suggestions');

      if (kind === 'support')
        if (disable) await setSupportCategory(undefined, message.guild!.id);
        else await setSupportCategory(channel.id, message.guild!.id);

      if (kind === 'ticket-logs')
        if (disable) await disableLogs('ticket', message.guild!.id);
        else await setTicketLogs(channel.id, message.guild!.id);

      if (kind === 'join-logs')
        if (disable) await disableLogs('join', message.guild!.id);
        else await setJoinLogs(channel.id, message.guild!.id);

      if (kind === 'message-logs')
        if (disable) await disableLogs('message', message.guild!.id);
        else await setMessageLogs(channel.id, message.guild!.id);

      if (kind === 'moderator-logs')
        if (disable) await disableLogs('moderator', message.guild!.id);
        else await setModeratorLogs(channel.id, message.guild!.id);
    } catch (e) {
      return await message.reply('Unable to update channel settings');
    }
    return await message.reply('Channel settings have been updated!');
  }
}
