import { Listener, PieceContext, ListenerOptions } from '@sapphire/framework';
import { Settings, Welcome } from '../database';
import { type GuildMember, type TextChannel, MessageEmbed } from 'discord.js';
import { notification } from '../lib/embeds';
import { colors } from '../lib/constants';

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
    const welcomeSettings = await db.findOne(Welcome, {
      guildId: member.guild.id
    });
    if (guildSettings?.joinLogs) {
      const logsChannel = <TextChannel>await member.guild.channels.fetch(guildSettings.joinLogs);
      const desc = `**TAG:** ${member.user.tag}\n**ID:** ${member.id}`;
      const embed = notification(member.user, 'success', 'New Member', desc);
      embed
        .setThumbnail(member.displayAvatarURL())
        .setFooter({ text: 'Created at' })
        .setTimestamp(member.user.createdTimestamp);
      await logsChannel.send({ embeds: [embed] });
    }
    if (welcomeSettings?.channelId && welcomeSettings.channelId !== 'disable') {
      const user = /{\s*user\s*}/gi;
      const username = /{\s*user.name\s*}/gi;
      const discriminator = /{\s*user.discriminator\s*}/gi;
      const userTag = /{\s*user.tag\s*}/gi;
      const server = /{\s*server\s*}/gi;
      const msg = welcomeSettings.message
        .replace(user, member.user.toString())
        .replace(username, member.user.username)
        .replace(discriminator, member.user.discriminator)
        .replace(userTag, member.user.tag)
        .replace(server, member.guild.name);
      const userId = welcomeSettings.userId > 0 ? welcomeSettings.userId : member.guild.memberCount + 1;
      if (welcomeSettings.image) {
        const embed = new MessageEmbed()
          .setDescription(msg)
          .setImage(welcomeSettings.image)
          .setColor(colors.blurple)
          .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL() })
          .setTitle(`Joined ID: ${userId}`);
        if (welcomeSettings.channelId === 'dm') await member.user.send({ embeds: [embed] }).catch(() => {});
        else {
          const welcomeChannel = <TextChannel>await member.guild.channels.fetch(welcomeSettings.channelId);
          await welcomeChannel.send({ embeds: [embed] }).catch(() => {});
        }
      } else if (welcomeSettings.channelId === 'dm') await member.user.send(msg).catch(() => {});
      else {
        const welcomeChannel = <TextChannel>await member.guild.channels.fetch(welcomeSettings.channelId);
        await welcomeChannel.send(msg).catch(() => {});
      }
      welcomeSettings.userId = userId + 1;
      await db.persistAndFlush(welcomeSettings);
    }
  }
}
