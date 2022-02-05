import { Listener, PieceContext, ListenerOptions } from '@sapphire/framework';
import { Settings } from '../database';
import type { GuildBan, TextChannel } from 'discord.js';
import { notification } from '../lib/embeds';

export class UnbanListener extends Listener {
  public constructor(context: PieceContext, options: ListenerOptions) {
    super(context, {
      ...options,
      event: 'guildBanRemove'
    });
  }

  public async run({ guild, user }: GuildBan) {
    const auditLogs = (
      await guild.fetchAuditLogs({
        limit: 1,
        type: 23
      })
    ).entries.first()!;

    const { executor } = auditLogs;

    const db = this.container.db.em.fork();
    const guildSettings = await db.findOne(Settings, {
      guildId: guild.id
    });
    if (guildSettings?.moderatorLogs) {
      const logsChannel = <TextChannel>await guild.channels.fetch(guildSettings.moderatorLogs);
      const desc = `**TAG:** ${user.tag}\n**ID:** ${user.id}`;

      const embed = notification(user, 'success', 'Member Unbanned', desc);
      embed.setThumbnail(user.displayAvatarURL()).setFooter({ text: 'Created at' }).setTimestamp(user.createdTimestamp);

      if (executor)
        embed.setFooter({ text: `By ${executor.tag}`, iconURL: executor.displayAvatarURL() }).setTimestamp();

      await logsChannel.send({ embeds: [embed] });
    }
  }
}
