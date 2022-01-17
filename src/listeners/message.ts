import { Listener, PieceContext, ListenerOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { Tickets } from '../database';

export class MessageListener extends Listener {
  public constructor(context: PieceContext, options: ListenerOptions) {
    super(context, {
      ...options,
      event: 'messageCreate'
    });
  }

  public async run(message: Message) {
    const db = this.container.db.em.fork();
    if (message.guildId) {
      const ticket = await db.findOne(Tickets, {
        channelId: message.channel.id,
        status: 'open'
      });
      if (ticket && message.content) {
        ticket.messages.push(message.content);
        await db.persistAndFlush([ticket]);
      }
    }
  }
}
