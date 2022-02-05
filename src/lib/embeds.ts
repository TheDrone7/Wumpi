import { container } from '@sapphire/framework';
import { MessageEmbed, type User } from 'discord.js';
import { colors } from './constants';

export const notification = (
  author: User | undefined,
  kind: 'success' | 'info' | 'error' | 'warn',
  title: string,
  message: string
) => {
  const embed = new MessageEmbed().setTitle(title).setDescription(message).setTimestamp().setColor(colors[kind]);
  if (author) embed.setFooter({ text: author.username, iconURL: author.displayAvatarURL() });
  return embed;
};

export const helpEmbed = (title: string, e?: MessageEmbed) => {
  return (e || new MessageEmbed())
    .setTitle(title)
    .setTimestamp()
    .setColor(colors.blurple)
    .setThumbnail(container.client.user!.displayAvatarURL());
};
