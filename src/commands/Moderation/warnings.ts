import { Command, CommandOptions, Args } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { type Message, MessageEmbed } from 'discord.js';
import { getWarnings } from '../../database';
import { colors } from '../../lib/constants';

@ApplyOptions<CommandOptions>({
  name: 'warnings',
  description: 'View all warnings of a user in your server!',
  category: 'Moderation',
  syntax: '<member>',
  runIn: 'GUILD_ANY',
  cooldownDelay: 10_000,
  requiredUserPermissions: ['MODERATE_MEMBERS'],
  requiredClientPermissions: ['MODERATE_MEMBERS']
})
export class WarnCommand extends Command {
  public async messageRun(message: Message, args: Args) {
    const member = await args.pick('member').catch(() => {
      message.reply('Please provide a user to view warnings of.');
    });

    if (!member) return;
    const guild = message.guild!;

    let warnings = [];

    try {
      warnings = await getWarnings(member.id, guild.id);
    } catch (e) {
      this.container.logger.error(e);
      return message.reply('There was an error while getting the warnings of the user.');
    }

    const executor = message.author;
    const embed = new MessageEmbed();
    embed
      .setTitle('Warnings of ' + member.user.tag)
      .setColor(colors.blurple)
      .setThumbnail(member.user.displayAvatarURL())
      .setFooter({ text: `By ${executor.tag}`, iconURL: executor.displayAvatarURL() })
      .setTimestamp();

    for (const warning of warnings) {
      const overview = `FOR: \`${warning.reason}\`\nBy: ${warning.moderator.tag}`;
      embed.addField('Warning #' + warning.id, overview);
    }

    return message.channel.send({ embeds: [embed] });
  }
}
