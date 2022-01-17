import type { Args } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { type Message, MessageEmbed } from 'discord.js';
import details from '../../lib/details';
import { deleteWarning, getWarnings, warnUser } from '../../database';
import { notification } from '../../lib/embeds';
import { moderatorLog } from '../../lib/guildLogs';
import { SubCommandPluginCommand } from '@sapphire/plugin-subcommands';
import { colors } from '../../lib/constants';

@ApplyOptions<SubCommandPluginCommand.Options>({
  name: 'warn',
  aliases: ['warnings', 'warning', 'warns'],
  description: "Manage a user's warnings in your server!",
  category: 'Moderation',
  syntax: '<(add)|(remove|delete)|(show|view)> (<member> [reason])|(<id>)|(<member>)',
  runIn: 'GUILD_ANY',
  cooldownDelay: 10_000,
  detailedDescription: details.warn,
  requiredUserPermissions: ['MODERATE_MEMBERS'],
  requiredClientPermissions: ['MODERATE_MEMBERS'],
  subCommands: ['add', 'remove', 'delete', 'show', 'view']
})
export class WarnCommand extends SubCommandPluginCommand {
  public async add(message: Message, args: Args) {
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

  public async remove(message: Message, args: Args) {
    const id = await args.pick('number').catch(() => {
      message.reply('Please provide a warning ID to delete.');
    });

    if (!id) return;

    const guild = message.guild!;

    const { success, error, warning } = await deleteWarning(id, guild.id);

    if (!success) return message.reply(error!);

    const user = await this.container.client.users.fetch(warning!.userId);

    const desc = `**TAG:** ${user.tag}\n**ID:** ${user.id}\n\nFOR: \`${warning!.reason}\`.\n`;
    const executor = message.author;

    const embed = notification(message.author, 'success', 'Member Warning deleted', desc);
    embed.setThumbnail(user.displayAvatarURL()).setFooter({ text: 'Created at' }).setTimestamp(user.createdTimestamp);
    embed.setFooter({ text: `By ${executor.tag}`, iconURL: executor.displayAvatarURL() });

    await moderatorLog(guild.id, embed);
    return message.reply(`Warning with ID ${id} has been deleted.`);
  }

  public async delete(message: Message, args: Args) {
    return this.remove(message, args);
  }

  public async show(message: Message, args: Args) {
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

  public async view(message: Message, args: Args) {
    return this.show(message, args);
  }
}
