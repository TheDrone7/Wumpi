import { Listener, PieceContext, ListenerOptions } from '@sapphire/framework';
import { Settings } from '../database';
import type { Message, TextChannel, Snowflake, Collection } from 'discord.js';
import { notification } from '../lib/embeds';

export class MessageDeleteBulkListener extends Listener {
  public constructor(context: PieceContext, options: ListenerOptions) {
    super(context, {
      ...options,
      event: 'messageDeleteBulk'
    });
  }

  public async run(messages: Collection<Snowflake, Message>) {
    const message = messages.first()!;
    const guild = message.guild!;

    const db = this.container.db.em.fork();
    const guildSettings = await db.findOne(Settings, {
      guildId: guild.id
    });

    if (guildSettings?.messageLogs) {
      const logsChannel = <TextChannel>await guild.channels.fetch(guildSettings.messageLogs);
      const desc = `${messages.size} messages were deleted in ${message.channel.toString()}.`;

      const embed = notification(this.container.client.user!, 'error', 'Bulk Message Deleted', desc);

      await logsChannel.send({ embeds: [embed, ...message.embeds] });
    }
  }
}
