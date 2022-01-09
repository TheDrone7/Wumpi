import { Listener, PieceContext, ListenerOptions } from '@sapphire/framework';
import { Settings } from '../database';
import type { GuildMember, TextChannel } from 'discord.js';
import { notification } from '../lib/embeds';

export class JoinListener extends Listener {
  public constructor(context: PieceContext, options: ListenerOptions) {
    super(context, {
      ...options,
      event: 'guildMemberAdd'
    });
  }

  public async run(member: GuildMember) {
    const db = this.container.db.em.fork();
    const guildSettings = await db.findOne(Settings, {
      guildId: member.guild.id
    });
    if (guildSettings?.joinLogs) {
      const logsChannel = (await member.guild.channels.fetch(guildSettings.joinLogs)) as TextChannel;
      const desc = `**TAG:** ${member.user.tag}\n**ID:** ${member.id}`;
      const embed = notification(member.user, 'success', 'New Member', desc);
      embed
        .setThumbnail(member.displayAvatarURL())
        .setFooter({ text: 'Created at' })
        .setTimestamp(member.user.createdTimestamp);
      await logsChannel.send({ embeds: [embed] });
    }
  }
}
