import { Listener, PieceContext, ListenerOptions } from '@sapphire/framework';
import { Settings } from '../database';
import type { Message, TextChannel } from 'discord.js';
import { notification } from '../lib/embeds';

export class MessageUpdateListener extends Listener {
  public constructor(context: PieceContext, options: ListenerOptions) {
    super(context, {
      ...options,
      event: 'messageUpdate'
    });
  }

  public async run(message: Message, newMessage: Message) {
    const guild = message.guild!;

    const db = this.container.db.em.fork();
    const guildSettings = await db.findOne(Settings, {
      guildId: guild.id
    });

    if (guildSettings?.messageLogs) {
      const logsChannel = <TextChannel>await guild.channels.fetch(guildSettings.messageLogs);
      const desc = `**ID:** ${message.id}`;

      const embed = notification(message.author, 'error', 'Message Edited', desc);
      if (message.content !== newMessage.content) {
        const oldWords = message.content.split(' '),
          newWords = newMessage.content.split(' ');
        let oldContent = '';
        for (const word of oldWords)
          if (oldContent.length + word.length > 1000) {
            embed.addField('Old Content', oldContent);
            oldContent = word;
          } else oldContent += word;
        if (oldContent.length) embed.addField('Old Content', oldContent);
        let newContent = '';
        for (const word of newWords)
          if (newContent.length + word.length > 1000) {
            embed.addField('New Content', newContent);
            newContent = word;
          } else newContent += word;
        if (newContent.length) embed.addField('New Content', newContent);
      }

      if (message.embeds.length > newMessage.embeds.length)
        embed.addField('Embeds', `${message.embeds.length - newMessage.embeds.length} embed(s) were deleted`);
      if (message.embeds.length < newMessage.embeds.length)
        embed.addField('Embeds', `${newMessage.embeds.length - message.embeds.length} embed(s) were added`);

      if (message.attachments.size > newMessage.attachments.size)
        embed.addField(
          'Attachments',
          `${message.attachments.size - newMessage.attachments.size} attached files were removed.`
        );
      if (message.attachments.size < newMessage.attachments.size)
        embed.addField(
          'Attachments',
          `${newMessage.attachments.size - message.attachments.size} attached files were added.`
        );

      await logsChannel.send({ embeds: [embed] });
    }
  }
}
