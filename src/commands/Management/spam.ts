import type { Args } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import type { Message } from 'discord.js';
import details from '../../lib/details';
import { SubCommandPluginCommand } from '@sapphire/plugin-subcommands';
import { limit } from '../../database/utilities/automod';

@ApplyOptions<SubCommandPluginCommand.Options>({
  name: 'spam',
  aliases: ['spam'],
  description: 'Manage the number of emojis and/or repeated words in a message!',
  category: 'Management',
  syntax: '<emojis|words> [count]',
  runIn: 'GUILD_ANY',
  cooldownDelay: 5_000,
  detailedDescription: details.spam,
  requiredUserPermissions: ['ADMINISTRATOR'],
  requiredClientPermissions: ['ADMINISTRATOR'],
  subCommands: ['emojis', 'words', { input: 'default', default: true }]
})
export class BlackListCommand extends SubCommandPluginCommand {
  public default(message: Message) {
    return message.reply('Please specify a valid option - `emojis`, `words`.');
  }

  public async emojis(message: Message, args: Args) {
    const num = await args.pick('number').catch(() => undefined);

    try {
      await limit(message.guildId!, 'emojis', num);
    } catch (e) {
      this.container.logger.error(e);
      return message.reply('There was an error while updating the number of allowed emojis.');
    }

    return message.channel.send(
      num ? `Updated the number of allowed emojis to ${num}.` : 'Disabled emojis spam check.'
    );
  }

  public async words(message: Message, args: Args) {
    const num = await args.pick('number').catch(() => undefined);

    try {
      await limit(message.guildId!, 'caps', num);
    } catch (e) {
      this.container.logger.error(e);
      return message.reply('There was an error while updating the number of allowed repeated words.');
    }

    return message.channel.send(
      num ? `Updated the number of allowed repeated words to ${num}.` : 'Disabled repeated words check.'
    );
  }
}
