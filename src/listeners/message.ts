import { Listener, PieceContext, ListenerOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { Automod, Tickets, Warnings } from '../database';
import { moderatorLog } from '../lib/guildLogs';
import { notification } from '../lib/embeds';
import { AutomodLog, AutomodMessage } from '../lib/constants';

export class MessageListener extends Listener {
  public constructor(context: PieceContext, options: ListenerOptions) {
    super(context, {
      ...options,
      event: 'messageCreate'
    });
  }

  public async run(message: Message) {
    const db = this.container.db.em.fork();
    if (message.guildId) {
      // Log ticket message.
      const ticket = await db.findOne(Tickets, {
        channelId: message.channel.id,
        status: 'open'
      });
      if (ticket && message.content) {
        ticket.messages.push(message.content);
        await db.persistAndFlush([ticket]);
      }

      // Automod checks
      let automod = <Automod | null | undefined>this.container.automod.get(message.guildId);
      if (!automod)
        automod = await db.findOne(Automod, {
          guildId: message.guildId
        });
      if (automod) {
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

          if (automod.capitalsLimit && automod.capitalsLimit > 0) {
            const pattern = `(\\w)\\${automod.capitalsLimit}+`;
            const matches = message.content.match(pattern) || [];
            if (matches.length > automod.capitalsLimit) return this.moderate(message, 'spam');
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
