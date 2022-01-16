import { Command, CommandOptions, Args } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import type { Message } from 'discord.js';
import details from '../../lib/details';

@ApplyOptions<CommandOptions>({
  name: 'ban',
  description: 'Kick a user from your server!',
  category: 'Moderation',
  syntax: '<member> [reason]',
  runIn: 'GUILD_ANY',
  cooldownDelay: 10_000,
  detailedDescription: details.kick,
  requiredUserPermissions: ['KICK_MEMBERS'],
  requiredClientPermissions: ['KICK_MEMBERS']
})
export class KickCommand extends Command {
  public async messageRun(message: Message, args: Args) {
    const member = await args.pick('member').catch(() => {
      message.reply('Please provide a user to kick');
    });
    const reason = args.finished ? 'No reason.' : await args.rest('string');

    if (!member) return;
    const guild = message.guild!;

    if (!member.user.bot) member.send(`You were kicked from **${guild.name}** for \`${reason}\`.`).catch();

    const result = await member.kick(reason).catch(() => {
      message.reply('Unable to kick the user.');
      return undefined;
    });

    if (result) return message.channel.send(`Kicked ${member.user.tag}.`);
    else return;
  }
}
