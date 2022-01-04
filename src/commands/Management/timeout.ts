import { Args, Command, CommandOptions } from '@sapphire/framework';
import { Duration } from '@sapphire/time-utilities';
import { ApplyOptions } from '@sapphire/decorators';
import type { Message } from 'discord.js';

@ApplyOptions<CommandOptions>({
  name: 'timeout',
  aliases: ['mute', 'tempmute'],
  description: 'Timeout a user in your server!',
  category: 'Management',
  syntax: '<member> [duration] [reason]',
  runIn: 'GUILD_ANY',
  cooldownDelay: 10_000,
  requiredUserPermissions: ['MODERATE_MEMBERS'],
  requiredClientPermissions: ['MODERATE_MEMBERS']
})
export class TimeoutCommand extends Command {
  public async messageRun(message: Message, args: Args) {
    const member = await args.pick('member').catch(() => {
      message.reply('Please provide a user to timeout.');
    });
    let length = args.finished ? '5m' : await args.pick('string');
    let reason = args.finished ? 'No reason.' : await args.rest('string');

    let duration = new Duration(length).offset;

    if (isNaN(duration)) {
      reason = length + (reason !== 'No reason.' ? reason : '');
      length = '5m';
      duration = 300_000;
    }

    if (!member) return;
    const guild = message.guild!;

    await member.send(
      `You were timed out from **${guild.name}** for ${length} for reason: \`${reason}\`.`
    );
    await member.timeout(duration, reason);

    return message.channel.send(`Timed out ${member.user.tag} for ${length}.`);
  }
}
