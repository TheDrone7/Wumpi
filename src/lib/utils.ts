import { send } from '@sapphire/plugin-editable-commands';
import { Message, MessageEmbed } from 'discord.js';
import { RandomLoadingMessage } from './constants';

const expression =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)?/gi;
const regex = new RegExp(expression);

export function pickRandom<T>(array: readonly T[]): T {
  const { length } = array;
  return array[Math.floor(Math.random() * length)];
}

export const checkLink = (str: string) => {
  return !!str.match(regex);
};

export function sendLoadingMessage(message: Message): Promise<typeof message> {
  return send(message, {
    embeds: [new MessageEmbed().setDescription(pickRandom(RandomLoadingMessage)).setColor('#FF0000')]
  });
}
