import { Listener, PieceContext, ListenerOptions } from '@sapphire/framework';
import { Settings } from '../database';
import type { Message, TextChannel } from 'discord.js';
import { notification } from '../lib/embeds';

export class MessageDeleteListener extends Listener {
  public constructor(context: PieceContext, options: ListenerOptions) {
    super(context, {
      ...options,
      event: 'messageDelete'
    });
  }

  public async run(message: Message) {
    const guild = message.guild!;

    const db = this.container.db.em.fork();
    const guildSettings = await db.findOne(Settings, {
      guildId: guild.id
    });

    if (guildSettings?.messageLogs) {
      const logsChannel = <TextChannel>await guild.channels.fetch(guildSettings.messageLogs);
      const desc = `**ID:** ${message.id}`;

      const embed = notification(this.container.client.user!, 'error', 'Message Deleted', desc);
      if (message.content) embed.addField('CONTENT', message.content);
      if (message.embeds.length) embed.addField('EMBEDS', `There are ${message.embeds.length} embeds.`);
      if (message.attachments.size)
        embed.addField(
          'ATTACHMENTS',
          `There are ${message.attachments.size} attachments.\n\n${message.attachments.map((a) => a.url).join('\n')}`
        );

      await logsChannel.send({ embeds: [embed, ...message.embeds] });
    }
  }
}
