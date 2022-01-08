import { Listener, PieceContext, ListenerOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { Ticket } from '../database';

export class MessageListener extends Listener {
  public constructor(context: PieceContext, options: ListenerOptions) {
    super(context, {
      ...options,
      event: 'message'
    });
  }

  public async run(message: Message) {
    const db = this.container.db.em.fork();
    if (message.guildId) {
      const ticket = await db.findOne(Ticket, {
        userId: message.author.id
      });
      if (ticket && message.content) {
        ticket.messages.push(message.content);
        await db.persistAndFlush([ticket]);
      }
    }
  }
}
