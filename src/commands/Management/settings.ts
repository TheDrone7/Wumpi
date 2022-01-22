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
  setModeratorLogs,
  setSupportMessage
} from '../../database/';
import details from '../../lib/details';

@ApplyOptions<CommandOptions>({
  name: 'set',
  description: 'Modify the admin settings in your server!',
  category: 'Management',
  runIn: 'GUILD_ANY',
  cooldownDelay: 10_000,
  flags: ['disable'],
  syntax: '<setting> [--disable] <channel>',
  detailedDescription: details.set,
  requiredUserPermissions: ['ADMINISTRATOR']
})
export class SettingsCommand extends Command {
  public async messageRun(message: Message, args: Args) {
    const kind = (await args.pick('string').catch(() => '')).toLowerCase().trim();
    const disable = args.getFlags('disable');
    const channel = await args.pick('channel').catch(async () => await args.pick('string').catch(() => 'null'));

    if (!kind || (!channel && !disable))
      return message.reply(
        `Please provide the channel type and the channel or disable. Use \`${this.container.client.fetchPrefix(
          message
        )}help set\` to learn more`
      );

    try {
      if (typeof channel === 'string' && channel !== 'null') {
        if (channel.length > 500)
          return message.channel.send('The message is too long, it needs to be less than 500 characters.');

        if (kind === 'support-message')
          if (disable) await setSupportCategory(message.guild!.id, undefined);
          else await setSupportMessage(message.guild!.id, channel);
        else return message.reply('Invalid config');
      } else if (kind === 'user-only' && channel !== 'null')
        if (disable) await removeChannelType(channel.id, message.guild!.id, 'user');
        else await setChannelType(channel.id, message.guild!.id, 'user');
      else if (kind === 'bot-only' && channel !== 'null')
        if (disable) await removeChannelType(channel.id, message.guild!.id, 'bot');
        else await setChannelType(channel.id, message.guild!.id, 'user');
      else if (kind === 'suggestions' && channel !== 'null')
        if (disable) await removeChannelType(channel.id, message.guild!.id, 'suggestions');
        else await setChannelType(channel.id, message.guild!.id, 'suggestions');
      else if (kind === 'support') {
        if (disable) await setSupportCategory(message.guild!.id, undefined);
        else if (channel !== 'null') await setSupportCategory(message.guild!.id, channel.id);
      } else if (kind === 'ticket-logs') {
        if (disable) await disableLogs('ticket', message.guild!.id);
        else if (channel !== 'null') await setTicketLogs(channel.id, message.guild!.id);
      } else if (kind === 'join-logs') {
        if (disable) await disableLogs('join', message.guild!.id);
        else if (channel !== 'null') await setJoinLogs(channel.id, message.guild!.id);
      } else if (kind === 'message-logs') {
        if (disable) await disableLogs('message', message.guild!.id);
        else if (channel !== 'null') await setMessageLogs(channel.id, message.guild!.id);
      } else if (kind === 'moderator-logs') {
        if (disable) await disableLogs('moderator', message.guild!.id);
        else if (channel !== 'null') await setModeratorLogs(channel.id, message.guild!.id);
      } else return message.reply('Invalid config');
    } catch (e: any) {
      await this.container.logger.error(e.stack || e.message || e);
      return await message.reply('Unable to update channel settings');
    }
    return await message.reply('Channel settings have been updated!');
  }
}
