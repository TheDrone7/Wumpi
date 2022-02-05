import { Listener, PieceContext, ListenerOptions } from '@sapphire/framework';
import { Settings } from '../database';
import type { GuildChannel, TextChannel } from 'discord.js';
import { notification } from '../lib/embeds';

export class ChannelUpdateListener extends Listener {
  public constructor(context: PieceContext, options: ListenerOptions) {
    super(context, {
      ...options,
      event: 'channelUpdate'
    });
  }

  public async run(channel: GuildChannel, newChannel: GuildChannel) {
    const guild = channel.guild;

    const auditLogs = (
      await guild.fetchAuditLogs({
        limit: 1,
        type: 11
      })
    ).entries.first()!;

    const { executor, changes } = auditLogs;

    const db = this.container.db.em.fork();
    const guildSettings = await db.findOne(Settings, {
      guildId: guild.id
    });

    if (guildSettings?.moderatorLogs && changes) {
      const logsChannel = <TextChannel>await guild.channels.fetch(guildSettings.moderatorLogs);
      const channelKind = newChannel.isVoice() ? 'VOICE' : newChannel.isThread() ? 'THREAD' : 'TEXT';
      const desc = `**ID:** ${channel.id}\n**NAME :** ${newChannel.name}\n**TYPE:** ${channelKind}`;

      const embed = notification(this.container.client.user!, 'warn', 'Channel Updated', desc);
      if (executor)
        embed.setFooter({ text: `By ${executor.tag}`, iconURL: executor.displayAvatarURL() }).setTimestamp();

      for (const change of changes) {
        const oldVal = change.old?.toString() || 'None';
        const newVal = change.new?.toString() || 'None';
        embed.addField(
          change.key.toUpperCase() + ' UPDATED',
          `FROM \n\`\`\`\n${oldVal}\`\`\`\n TO \n\`\`\`${newVal}\`\`\``,
          false
        );
      }

      await logsChannel.send({ embeds: [embed] });
    }
  }
}
