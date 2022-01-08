import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { addSupportChannel, Settings, Ticket } from '../../database';
import { notification } from '../../lib/embeds';

@ApplyOptions<CommandOptions>({
  name: 'support',
  description: 'Contact the server admins to ask for help!',
  category: 'Support',
  cooldownDelay: 300_000,
  runIn: 'GUILD_ANY',
  preconditions: ['SupportEnabled']
})
export class SupportCommand extends Command {
  public async messageRun(message: Message) {
    const db = this.container.db.em.fork();
    const prefix = this.container.client.fetchPrefix(message);

    const guildSettings = (await db.findOne(Settings, {
      guildId: message.guild!.id
    }))!;
    if (guildSettings.supportChannels?.includes(message.author.id))
      return message.reply('You already have an open ticket.');

    try {
      const newChannel = await message.guild!.channels.create(message.author.tag, {
        parent: guildSettings.supportCategory,
        type: 'GUILD_TEXT',
        permissionOverwrites: [
          {
            id: message.guild!.id,
            deny: ['VIEW_CHANNEL']
          },
          {
            id: this.container.client.user!.id,
            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
          },
          {
            id: message.author.id,
            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
          }
        ]
      });

      await addSupportChannel(message.author.id, message.guildId!);

      const newTicket = new Ticket();
      newTicket.messages = [];
      newTicket.channelId = newChannel.id;
      newTicket.userId = message.author.id;
      newTicket.status = 'open';

      await db.persistAndFlush([newTicket]);

      let content = `This ticket was opened by ${message.author.toString()}!\n`;
      content += `Please use ${prefix}close-ticket when the issue as resolved to delete this channel.\n\n`;
      if (guildSettings.supportMessage) content += `\n${guildSettings.supportMessage}`;

      const embed = notification(message.author, 'success', 'Support ticket', content);
      return newChannel.send({ embeds: [embed] });
    } catch (e: any) {
      const embed = notification(message.author, 'error', 'Error', e.stack || e.message || e.toString());
      return message.channel.send({ embeds: [embed] });
    }
  }
}
