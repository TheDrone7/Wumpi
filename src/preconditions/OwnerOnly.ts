import { Precondition } from '@sapphire/framework';
import type { Message } from 'discord.js';

export class OwnerOnlyPrecondition extends Precondition {
  run(message: Message) {
    return message.author.id === '374886124126208000'
      ? this.ok()
      : this.error({ message: 'Only the bot owner can use this command!' });
  }
}
