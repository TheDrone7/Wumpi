import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { unlockGuild } from '../../database/';

@ApplyOptions<CommandOptions>({
  name: 'unlock',
  description: 'End the lockdown in your server!',
  category: 'Moderation',
  runIn: 'GUILD_ANY',
  cooldownDelay: 300_000,
  requiredUserPermissions: ['MANAGE_GUILD'],
  requiredClientPermissions: ['MANAGE_GUILD', 'MANAGE_CHANNELS']
})
export class UnlockCommand extends Command {
  public async messageRun(message: Message) {
    const result = await unlockGuild(message.guild!.id, true);
    if (result === true) return message.reply('The lockdown has ended');
    else return message.reply('There is no lockdown going on right now.');
  }
}
