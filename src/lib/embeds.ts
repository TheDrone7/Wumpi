import { container } from '@sapphire/framework';
import { MessageEmbed, type User } from 'discord.js';
import { colors } from './constants';

export const notification = (
  author: User,
  kind: 'success' | 'info' | 'error' | 'warn',
  title: string,
  message: string
) => {
  return new MessageEmbed()
    .setTitle(title)
    .setDescription(message)
    .setTimestamp()
    .setColor(colors[kind])
    .setFooter(author.username, author.displayAvatarURL());
};

export const helpEmbed = (title: string, e?: MessageEmbed) => {
  return (e || new MessageEmbed())
    .setTitle(title)
    .setTimestamp()
    .setColor(colors.blurple)
    .setThumbnail(container.client.user!.displayAvatarURL());
};
