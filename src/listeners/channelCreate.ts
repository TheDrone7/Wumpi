import { Listener, PieceContext, ListenerOptions } from '@sapphire/framework';
import { Settings } from '../database';
import type { GuildChannel, TextChannel } from 'discord.js';
import { notification } from '../lib/embeds';

export class ChannelCreateListener extends Listener {
  public constructor(context: PieceContext, options: ListenerOptions) {
    super(context, {
      ...options,
      event: 'channelCreate'
    });
  }

  public async run(channel: GuildChannel) {
    const guild = channel.guild;

    const auditLogs = (
      await guild.fetchAuditLogs({
        limit: 1,
        type: 10
      })
    ).entries.first()!;

    const { executor } = auditLogs;

    const db = this.container.db.em.fork();
    const guildSettings = await db.findOne(Settings, {
      guildId: guild.id
    });

    if (guildSettings?.moderatorLogs) {
      const logsChannel = <TextChannel>await guild.channels.fetch(guildSettings.moderatorLogs);
      const channelKind = channel.isVoice() ? 'VOICE' : channel.isThread() ? 'THREAD' : 'TEXT';
      const desc = `**ID:** ${channel.id}\n**NAME :** ${channel.name}\n**TYPE:** ${channelKind}`;

      const embed = notification(this.container.client.user!, 'info', 'Channel Created', desc);
      if (executor)
        embed.setFooter({ text: `By ${executor.tag}`, iconURL: executor.displayAvatarURL() }).setTimestamp();

      await logsChannel.send({ embeds: [embed] });
    }
  }
}
