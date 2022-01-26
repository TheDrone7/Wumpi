import { Listener, PieceContext, ListenerOptions } from '@sapphire/framework';
import { Settings } from '../database';
import type { GuildMember, TextChannel } from 'discord.js';
import { notification } from '../lib/embeds';
import { DurationFormatter } from '@sapphire/time-utilities';

export class MemberUpdateListener extends Listener {
  public constructor(context: PieceContext, options: ListenerOptions) {
    super(context, {
      ...options,
      event: 'guildMemberUpdate'
    });
  }

  public async run(oldMember: GuildMember, member: GuildMember) {
    const db = this.container.db.em.fork();
    const guildSettings = await db.findOne(Settings, {
      guildId: member.guild.id
    });
    if (guildSettings?.moderatorLogs) {
      const logsChannel = <TextChannel>await member.guild.channels.fetch(guildSettings.moderatorLogs);
      if (typeof oldMember.communicationDisabledUntilTimestamp !== typeof member.communicationDisabledUntilTimestamp) {
        let embed;
        if (member.communicationDisabledUntilTimestamp === null) {
          const desc = `**TAG:** ${member.user.tag}\n**ID:** ${member.id}\n**TIMEOUT:** Ended`;
          embed = notification(member.user, 'success', 'Timeout finished', desc);
        } else {
          const time = member.communicationDisabledUntilTimestamp - Date.now();
          const formatter = new DurationFormatter();
          const desc = `**TAG:** ${member.user.tag}\n**ID:** ${member.id}\n**TIMEOUT:** ${formatter.format(time)}`;
          embed = notification(member.user, 'warn', 'Timed out', desc);
        }
        embed
          .setThumbnail(member.displayAvatarURL())
          .setFooter({ text: 'Created at' })
          .setTimestamp(member.user.createdTimestamp);
        await logsChannel.send({ embeds: [embed] });
      }
    }
  }
}
