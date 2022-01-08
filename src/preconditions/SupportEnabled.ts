import { Precondition } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { Settings } from '../database';

export class SupportPrecondition extends Precondition {
  async run(message: Message) {
    const db = this.container.db.em.fork();
    const guildSettings = await db.findOne(Settings, {
      guildId: message.guild!.id
    });
    if (!guildSettings?.supportCategory) return this.error({ message: 'Support is not enabled in this server.' });
    return this.ok();
  }
}
