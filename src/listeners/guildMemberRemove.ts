import { Listener, PieceContext, ListenerOptions } from '@sapphire/framework';
import { Settings } from '../database';
import type { GuildMember, TextChannel } from 'discord.js';
import { notification } from '../lib/embeds';

export class LeaveListener extends Listener {
  public constructor(context: PieceContext, options: ListenerOptions) {
    super(context, {
      ...options,
      event: 'guildMemberRemove'
    });
  }

  public async run(member: GuildMember) {
    const db = this.container.db.em.fork();
    const guildSettings = await db.findOne(Settings, {
      guildId: member.guild.id
    });
    if (guildSettings?.joinLogs) {
      const logsChannel = <TextChannel>await member.guild.channels.fetch(guildSettings.joinLogs);
      const desc = `**TAG:** ${member.user.tag}\n**ID:** ${member.id}`;
      const embed = notification(member.user, 'error', 'Member Left', desc);
      embed
        .setThumbnail(member.displayAvatarURL())
        .setFooter({ text: 'Joined at' })
        .setTimestamp(member.joinedTimestamp);
      await logsChannel.send({ embeds: [embed] });
    }
  }
}
