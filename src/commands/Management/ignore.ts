import type { Args } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import type { Message } from 'discord.js';
import details from '../../lib/details';
import { SubCommandPluginCommand } from '@sapphire/plugin-subcommands';
import { ignore } from '../../database/utilities/automod';

@ApplyOptions<SubCommandPluginCommand.Options>({
  name: 'ignore',
  aliases: ['except'],
  description: 'Add or remove channels to ignore automod features in your server!',
  category: 'Management',
  syntax: '<enable|disable> <blacklist|spam|invites|ratelimit> <#channel>',
  runIn: 'GUILD_ANY',
  cooldownDelay: 5_000,
  detailedDescription: details.ignore,
  requiredUserPermissions: ['ADMINISTRATOR'],
  requiredClientPermissions: ['ADMINISTRATOR'],
  subCommands: ['enable', 'disable']
})
export class BlackListCommand extends SubCommandPluginCommand {
  public async enable(message: Message, args: Args) {
    const kind = <'blacklist' | 'ratelimit' | 'spam' | 'invites'>await args.pick('string');
    if (!kind) return message.reply('Please specify the feature you want to ignore.');

    const channel = await args.pick('channel');
    if (!channel) return message.reply('Please specify the channel to start ignoring.');

    try {
      await ignore(message.guildId!, channel.id, kind, false);
    } catch (e) {
      this.container.logger.error(e);
      return message.reply('There was an error while adding the channel to the ignored list.');
    }

    return message.channel.send(`Added ${channel} to the ignored list for \`${kind}\`.`);
  }

  public async disable(message: Message, args: Args) {
    const kind = <'blacklist' | 'ratelimit' | 'spam' | 'invites'>await args.pick('string');
    if (!kind) return message.reply('Please specify the feature you want to ignore.');

    const channel = await args.pick('channel');
    if (!channel) return message.reply('Please specify the channel to stop ignoring.');

    try {
      await ignore(message.guildId!, channel.id, kind, true);
    } catch (e) {
      this.container.logger.error(e);
      return message.reply('There was an error while removing the channel from the ignored list.');
    }

    return message.channel.send(`Removed ${channel} from the ignored list for \`${kind}\`.`);
  }
}
