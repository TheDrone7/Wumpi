import { container } from '@sapphire/framework';
import { Welcome } from '../';

export const setChannel = async (guildId: string, channel: string) => {
  const db = container.db.em.fork();
  let settings = await db.findOne(Welcome, { guildId });
  if (!settings) settings = new Welcome();
  settings.guildId = guildId;
  settings.channelId = channel.toLowerCase();
  if (!settings.message) settings.message = 'Welcome to the server, {user}!';
  db.persistAndFlush([settings]);
};

export const setMessage = async (guildId: string, message: string) => {
  const db = container.db.em.fork();
  let settings = await db.findOne(Welcome, { guildId });
  if (!settings) settings = new Welcome();
  settings.guildId = guildId;
  settings.message = message;
  if (!settings.channelId) settings.channelId = 'disable';
  db.persistAndFlush([settings]);
};

export const setImage = async (guildId: string, image: string) => {
  const db = container.db.em.fork();
  let settings = await db.findOne(Welcome, { guildId });
  if (!settings) settings = new Welcome();
  settings.guildId = guildId;
  settings.image = image;
  if (!settings.message) settings.message = 'Welcome to the server, {user}!';
  if (!settings.channelId) settings.channelId = 'disable';
  db.persistAndFlush([settings]);
};
