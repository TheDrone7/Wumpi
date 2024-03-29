import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions, Args } from '@sapphire/framework';
import type { Message } from 'discord.js';
import details from '../../lib/details';

@ApplyOptions<CommandOptions>({
  name: 'ban',
  description: 'Ban a user from your server!',
  category: 'Moderation',
  syntax: '<member> [reason]',
  runIn: 'GUILD_ANY',
  cooldownDelay: 10_000,
  detailedDescription: details.ban,
  requiredUserPermissions: ['BAN_MEMBERS'],
  requiredClientPermissions: ['BAN_MEMBERS']
})
export class BanCommand extends Command {
  public async messageRun(message: Message, args: Args) {
    const member = await args.pick('member').catch(() => {
      message.reply('Please provide a user to ban');
    });
    const reason = args.finished ? 'No reason.' : await args.rest('string');

    if (!member) return;
    const guild = message.guild!;

    if (!member.user.bot) member.send(`You were banned from **${guild.name}** for \`${reason}\`.`).catch();

    const result = await member.ban({ reason }).catch(() => {
      message.reply('Unable to ban the user.');
      return undefined;
    });

    if (result) return message.channel.send(`Banned ${member.user.tag}.`);
    else return;
  }
}
