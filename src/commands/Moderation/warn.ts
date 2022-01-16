import { Command, CommandOptions, Args } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import type { Message } from 'discord.js';
import details from '../../lib/details';
import { warnUser } from '../../database';
import { notification } from '../../lib/embeds';
import { moderatorLog } from '../../lib/guildLogs';

@ApplyOptions<CommandOptions>({
  name: 'warn',
  description: 'Warn a user in your server!',
  category: 'Moderation',
  syntax: '<member> [reason]',
  runIn: 'GUILD_ANY',
  cooldownDelay: 10_000,
  detailedDescription: details.warn,
  requiredUserPermissions: ['MODERATE_MEMBERS'],
  requiredClientPermissions: ['MODERATE_MEMBERS']
})
export class WarnCommand extends Command {
  public async messageRun(message: Message, args: Args) {
    const member = await args.pick('member').catch(() => {
      message.reply('Please provide a user to warn');
    });
    const reason = args.finished ? 'No reason.' : await args.rest('string');

    if (!member) return;
    const guild = message.guild!;

    try {
      await warnUser(member.id, message.author.id, guild.id, reason);
    } catch (e) {
      this.container.logger.error(e);
      return message.reply('There was an error while warning the user.');
    }

    if (!member.user.bot) member.send(`You were warned in **${guild.name}** for \`${reason}\`.`).catch();

    const desc = `**TAG:** ${member.user.tag}\n**ID:** ${member.user.id}\n\nFOR: \`${reason}\`.\n`;
    const executor = message.author;

    const embed = notification(message.author, 'warn', 'Member Warned', desc);
    embed
      .setThumbnail(member.user.displayAvatarURL())
      .setFooter({ text: 'Created at' })
      .setTimestamp(member.user.createdTimestamp);
    embed.setFooter({ text: `By ${executor.tag}`, iconURL: executor.displayAvatarURL() });

    await moderatorLog(guild.id, embed);
    return message.channel.send(`Warned ${member.user.tag}.`);
  }
}
