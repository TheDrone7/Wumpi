import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { delSupportChannel, Settings, Ticket } from '../../database';
import { notification } from '../../lib/embeds';

@ApplyOptions<CommandOptions>({
  name: 'close-ticket',
  description: 'Close the ticket you had opened!',
  category: 'Support',
  cooldownDelay: 300_000,
  runIn: 'GUILD_ANY',
  preconditions: ['SupportEnabled']
})
export class CloseTicketCommand extends Command {
  public async messageRun(message: Message) {
    const db = this.container.db.em.fork();

    const guildSettings = (await db.findOne(Settings, {
      guildId: message.guild!.id
    }))!;

    if (!guildSettings.supportChannels?.includes(message.author.id))
      return message.reply('You do not have an open ticket.');

    const ticket = (await db.findOne(Ticket, {
      userId: message.author.id,
      status: 'open'
    }))!;

    try {
      const channel = await message.guild!.channels.fetch(ticket.channelId).catch();

      if (channel) await channel.delete();
      await delSupportChannel(message.author.id, message.guildId!);

      ticket.status = 'closed';
      return await db.persistAndFlush([ticket]);
    } catch (e: any) {
      const embed = notification(message.author, 'error', 'Error', e.stack || e.message || e.toString());
      return message.channel.send({ embeds: [embed] }).catch();
    }
  }
}
