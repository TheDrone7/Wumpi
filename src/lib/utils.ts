import { send } from '@sapphire/plugin-editable-commands';
import { Message, MessageEmbed } from 'discord.js';
import { RandomLoadingMessage } from './constants';
import unlockGuild from './utilities/unlockGuild';

export function pickRandom<T>(array: readonly T[]): T {
  const { length } = array;
  return array[Math.floor(Math.random() * length)];
}

export function sendLoadingMessage(message: Message): Promise<typeof message> {
  return send(message, {
    embeds: [
      new MessageEmbed()
        .setDescription(pickRandom(RandomLoadingMessage))
        .setColor('#FF0000')
    ]
  });
}

export { unlockGuild };
