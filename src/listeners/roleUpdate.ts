import { Listener, PieceContext, ListenerOptions } from '@sapphire/framework';
import { Settings } from '../database';
import { type Role, type TextChannel, Permissions } from 'discord.js';
import { notification } from '../lib/embeds';

export class RoleUpdateListener extends Listener {
  public constructor(context: PieceContext, options: ListenerOptions) {
    super(context, {
      ...options,
      event: 'roleUpdate'
    });
  }

  public async run(role: Role, newRole: Role) {
    const guild = role.guild;

    const auditLogs = (
      await guild.fetchAuditLogs({
        limit: 1,
        type: 31
      })
    ).entries.first()!;

    const { executor, changes } = auditLogs;

    const db = this.container.db.em.fork();
    const guildSettings = await db.findOne(Settings, {
      guildId: guild.id
    });

    if (guildSettings?.moderatorLogs && changes) {
      const logsChannel = <TextChannel>await guild.channels.fetch(guildSettings.moderatorLogs);
      const desc = `**ID:** ${role.id}\n**NAME :** ${newRole.name}`;

      const embed = notification(this.container.client.user!, 'info', 'Role Updated', desc);
      if (executor)
        embed.setFooter({ text: `By ${executor.tag}`, iconURL: executor.displayAvatarURL() }).setTimestamp();
      if (newRole.color) embed.setColor(newRole.color);
      for (const change of changes) {
        let oldVal = change.old?.toString() || 'None';
        let newVal = change.new?.toString() || 'None';
        if (change.key === 'color') {
          oldVal = '#' + change.old!.toString(16).padStart(6, '0').toUpperCase();
          newVal = '#' + change.new!.toString(16).padStart(6, '0').toUpperCase();
          embed.addField(
            change.key.toUpperCase() + ' UPDATED',
            `FROM \n\`\`\`\n${oldVal}\`\`\`\n TO \n\`\`\`${newVal}\`\`\``,
            false
          );
        } else if (change.key === 'permissions') {
          let oldPerms = new Permissions(BigInt(change.old!.toString()));
          let newPerms = new Permissions(BigInt(change.new!.toString()));
          const removed = oldPerms
            .remove(newPerms.bitfield)
            .toArray()
            .map((p) => `- ${p}`)
            .join('\n');
          embed.addField('REMOVED PERMISSIONS', `\`\`\`\n${removed || 'NONE'}\`\`\`\n`);
          oldPerms = new Permissions(BigInt(change.old!.toString()));
          newPerms = new Permissions(BigInt(change.new!.toString()));
          const added = newPerms
            .remove(oldPerms.bitfield)
            .toArray()
            .map((p) => `- ${p}`)
            .join('\n');
          embed.addField('ADDED PERMISSIONS', `\`\`\`\n${added || 'NONE'}\`\`\`\n`);
        } else
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
