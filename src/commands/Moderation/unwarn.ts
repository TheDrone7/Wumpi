import { Command, CommandOptions, Args } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import type { Message } from 'discord.js';
import details from '../../lib/details';
import { deleteWarning } from '../../database';
import { notification } from '../../lib/embeds';
import { moderatorLog } from '../../lib/guildLogs';

@ApplyOptions<CommandOptions>({
  name: 'unwarn',
  description: 'Delete/Remove a warning in your server!',
  category: 'Moderation',
  syntax: '<id>',
  runIn: 'GUILD_ANY',
  cooldownDelay: 10_000,
  detailedDescription: details.unwarn,
  requiredUserPermissions: ['MODERATE_MEMBERS'],
  requiredClientPermissions: ['MODERATE_MEMBERS']
})
export class UnwarnCommand extends Command {
  public async messageRun(message: Message, args: Args) {
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
}
