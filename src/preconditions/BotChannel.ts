import { Precondition, PreconditionOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { Settings } from '../database';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<PreconditionOptions>({
  name: 'bot',
  enabled: true,
  position: 1
})
export class BotPrecondition extends Precondition {
  async run(message: Message) {
    const db = this.container.db.em.fork();
    const guildSettings = await db.findOne(Settings, {
      guildId: message.guild!.id
    });
    if (guildSettings && guildSettings.botChannel && message.channel.id !== guildSettings.botChannel)
      return this.error({ message: 'not-bot' });
    return this.ok();
  }
}
