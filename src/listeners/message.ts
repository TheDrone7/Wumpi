import { Listener, PieceContext, ListenerOptions } from '@sapphire/framework';
import { type Message, type TextChannel, MessageEmbed } from 'discord.js';
import { Automod, Settings, Tickets, Warnings } from '../database';
import { moderatorLog } from '../lib/guildLogs';
import { notification } from '../lib/embeds';
import { AutomodLog, AutomodMessage, colors } from '../lib/constants';

export class MessageListener extends Listener {
  public constructor(context: PieceContext, options: ListenerOptions) {
    super(context, {
      ...options,
      event: 'messageCreate'
    });
  }

  public async run(message: Message) {
    const db = this.container.db.em.fork();
    if (message.guild) {
      // Log ticket message.
      const ticket = await db.findOne(Tickets, {
        channelId: message.channel.id,
        status: 'open'
      });
      if (ticket && message.content) {
        ticket.messages.push(message.content);
        await db.persistAndFlush([ticket]);
      }

      const guildSettings = this.container.settings.has(message.guild.id)
        ? this.container.settings.get(message.guild.id)
        : await db.findOne(Settings, {
            guildId: message.guild.id
          });

      if (guildSettings) {
        const prefix = this.container.client.fetchPrefix(message);
        if (guildSettings.userOnly?.includes(message.channel.id)) await message.delete();
        if (
          guildSettings.botChannel &&
          message.content.startsWith(prefix!.toString()) &&
          guildSettings.botChannel !== message.channel.id
        ) {
          const channel = <TextChannel>await message.guild.channels.fetch(guildSettings.botChannel);
          await channel.send({
            content: `${message.author.toString()} Please use the bot commands here.`,
            allowedMentions: { users: [message.author.id] }
          });
        }
        if (guildSettings.suggestions?.includes(message.channel.id) && !message.author.bot) {
          const { content, member } = message;
          const embed = new MessageEmbed()
            .setTitle('NEW SUGGESTION - ' + member!.user.tag)
            .setThumbnail(member!.displayAvatarURL())
            .setDescription(content)
            .setColor(colors.blurple);
          const msg = await message.channel.send({ embeds: [embed] });
          await msg.react('👍');
          await msg.react('👎');
          await message.delete();
        }
      }

      // Automod checks
      const automod = this.container.automod.has(message.guild.id)
        ? this.container.automod.get(message.guild.id)
        : await db.findOne(Automod, {
            guildId: message.guildId
          });
      if (automod) {
        const memberRoles = message.member!.roles.cache;
        if (automod.staff && memberRoles.has(automod.staff)) return;

        if (!automod.ignoreBlacklist.includes(message.channel.id))
          if (automod.blacklist.some((w) => message.content.includes(w))) return this.moderate(message, 'blacklist');

        if (!automod.ignoreInvite.includes(message.channel.id))
          if (message.content.includes('discord.gg') || message.content.includes('discord.com/invite'))
            return this.moderate(message, 'invite');

        if (!automod.ignoreRatelimit.includes(message.channel.id))
          if (automod.ratelimitCount && automod.ratelimitDuration) {
            const messages = message.channel.messages.cache;
            const counted = messages.filter(
              (m) =>
                m.author === message.author &&
                message.createdTimestamp - m.createdTimestamp < automod!.ratelimitDuration!
            );
            if (counted.size > automod.ratelimitCount) return this.moderate(message, 'ratelimit');
          }

        if (!automod.ignoreSpam.includes(message.channel.id)) {
          if (
            automod.emojisLimit &&
            automod.emojisLimit > 0 &&
            (message.content.match(/<:/gi) || []).length > automod.emojisLimit
          )
            return this.moderate(message, 'emojis');

          if (automod.capitalsLimit && automod.capitalsLimit > 1) {
            const pattern = `(\\w)\\${automod.capitalsLimit}+`;
            const exp = new RegExp(pattern, 'gi');
            const matches = message.content.match(exp) || [];
            if (matches.length > automod.capitalsLimit) return this.moderate(message, 'spam');
            const wordPattern = `\\b(\\w+)${'\\s+\\1'.repeat(automod.capitalsLimit - 1)}\\b`;
            const wordExp = new RegExp(wordPattern, 'gi');
            const wordMatches = message.content.match(wordExp) || [];
            if (wordMatches.length) return this.moderate(message, 'spam');
          }
        }
      }
    }
    return;
  }

  private async moderate(message: Message, kind: 'blacklist' | 'invite' | 'ratelimit' | 'emojis' | 'spam') {
    const db = this.container.db.em.fork();
    const reason = AutomodLog[kind];
    const newWarn = new Warnings();
    newWarn.guildId = message.guildId!;
    newWarn.moderatorId = this.container.client.user!.id;
    newWarn.reason = 'AUTOMOD: ' + reason;
    newWarn.userId = message.author.id;

    await db.persist(newWarn).flush();

    const desc = `**TAG:** ${message.author.tag}\n**ID:** ${message.author.id}\n\nFOR: \`${reason}\`.\n`;
    const embed = notification(this.container.client.user!, 'warn', 'Automod violation', desc);
    await moderatorLog(message.guildId!, embed);
    await message.delete();
    return message.channel.send(message.author.toString() + ', ' + AutomodMessage[kind]);
  }
}
