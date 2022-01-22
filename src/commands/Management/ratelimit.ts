import type { Args } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import type { Message } from 'discord.js';
import details from '../../lib/details';
import { SubCommandPluginCommand } from '@sapphire/plugin-subcommands';
import { limit } from '../../database/utilities/automod';
import { Duration } from '@sapphire/time-utilities';

@ApplyOptions<SubCommandPluginCommand.Options>({
  name: 'ratelimit',
  aliases: ['rate-limit', 'message-limit'],
  description: 'Specify the number of messages that can be sent in a certain duration!',
  category: 'Management',
  syntax: '<count|duration> <amount>',
  runIn: 'GUILD_ANY',
  cooldownDelay: 5_000,
  detailedDescription: details.ratelimit,
  requiredUserPermissions: ['ADMINISTRATOR'],
  requiredClientPermissions: ['ADMINISTRATOR'],
  subCommands: ['count', 'duration', { input: 'default', default: true }]
})
export class BlackListCommand extends SubCommandPluginCommand {
  public default(message: Message) {
    return message.reply('Please specify a valid action - `count`, `duration`.');
  }

  public async count(message: Message, args: Args) {
    const num = await args.pick('number').catch();

    try {
      if (num) await limit(message.guild!.id, 'rlCount', num);
      else await limit(message.guild!.id, 'rlCount');
    } catch (e) {
      this.container.logger.error(e);
      return message.reply('There was an error modifying the ratelimit.');
    }

    if (num) return message.channel.send(`Set the limit of allowed messages to ${num}.`);
    else return message.channel.send('Disabled ratelimit');
  }

  public async duration(message: Message, args: Args) {
    const time = await args.pick('string').catch();
    const duration = time ? new Duration(time).offset : undefined;

    try {
      if (duration) await limit(message.guild!.id, 'rlTime', duration);
      else await limit(message.guild!.id, 'rlTime');
    } catch (e) {
      this.container.logger.error(e);
      return message.reply('There was an error modifying the ratelimit.');
    }

    if (duration) return message.channel.send(`Set the ratelimit duration to ${time}.`);
    else return message.channel.send('Disabled ratelimit');
  }
}
