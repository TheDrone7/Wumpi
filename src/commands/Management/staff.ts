import { Command, type Args, type CommandOptions } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import type { Message } from 'discord.js';
import details from '../../lib/details';
import { updateStaff } from '../../database/utilities/automod';

@ApplyOptions<CommandOptions>({
  name: 'staff',
  aliases: ['set-staff'],
  description: 'Update the staff role!',
  category: 'Management',
  syntax: '<@Role>',
  runIn: 'GUILD_ANY',
  cooldownDelay: 5_000,
  detailedDescription: details.staff,
  requiredUserPermissions: ['ADMINISTRATOR'],
  requiredClientPermissions: ['ADMINISTRATOR']
})
export class BlackListCommand extends Command {
  public async messageRun(message: Message, args: Args) {
    const role = await args.pick('role');
    if (!role) return message.reply('Please specify the role to use as the Staff role.');

    try {
      await updateStaff(message.guildId!, role.id);
    } catch (e) {
      this.container.logger.error(e);
      return message.reply('There was an error while updating the staff role.');
    }

    return message.channel.send(`Set ${role.toString()} to the staff role.`);
  }
}
