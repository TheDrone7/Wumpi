import { Listener, PieceContext, ListenerOptions } from '@sapphire/framework';
import { Settings } from '../database';
import type { GuildBan, TextChannel } from 'discord.js';
import { notification } from '../lib/embeds';

export class BanListener extends Listener {
  public constructor(context: PieceContext, options: ListenerOptions) {
    super(context, {
      ...options,
      event: 'guildBanAdd'
    });
  }

  public async run({ guild, user }: GuildBan) {
    const auditLogs = (
      await guild.fetchAuditLogs({
        limit: 1,
        type: 22
      })
    ).entries.first()!;

    const { reason, executor } = auditLogs;

    const db = this.container.db.em.fork();
    const guildSettings = await db.findOne(Settings, {
      guildId: guild.id
    });
    if (guildSettings?.moderatorLogs) {
      const logsChannel = <TextChannel>await guild.channels.fetch(guildSettings.moderatorLogs);
      const desc = `**TAG:** ${user.tag}\n**ID:** ${user.id}`;

      const embed = notification(user, 'error', 'Member Banned', desc);
      embed.setThumbnail(user.displayAvatarURL()).setFooter({ text: 'Created at' }).setTimestamp(user.createdTimestamp);
      if (reason) embed.addField('Reason', reason);
      if (executor)
        embed.setFooter({ text: `By ${executor.tag}`, iconURL: executor.displayAvatarURL() }).setTimestamp();

      await logsChannel.send({ embeds: [embed] });
    }
  }
}
