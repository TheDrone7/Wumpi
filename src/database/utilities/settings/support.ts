import { Settings } from '../../index';
import { container } from '@sapphire/framework';
import type { Snowflake } from 'discord.js';

export const setSupportCategory = async (guildId: Snowflake, channelId?: Snowflake) => {
  const db = container.db.em.fork();
  const guildSettings = await db.findOne(Settings, { guildId });
  const settings = guildSettings || new Settings();
  settings.guildId = guildId;
  settings.supportCategory = channelId;
  await db.persist(settings).flush();
  container.settings.set(guildId, settings);
};

export const addSupportChannel = async (channelId: Snowflake, guildId: Snowflake) => {
  const db = container.db.em.fork();
  const guildSettings = await db.findOne(Settings, { guildId });
  const settings = guildSettings || new Settings();
  settings.guildId = guildId;
  if (settings.supportChannels) settings.supportChannels.push(channelId);
  else settings.supportChannels = [channelId];
  await db.persist(settings).flush();
  container.settings.set(guildId, settings);
};

export const setSupportMessage = async (guildId: Snowflake, message?: Snowflake) => {
  const db = container.db.em.fork();
  const guildSettings = await db.findOne(Settings, { guildId });
  const settings = guildSettings || new Settings();
  settings.guildId = guildId;
  settings.supportMessage = message;
  await db.persist(settings).flush();
  container.settings.set(guildId, settings);
};

export const delSupportChannel = async (channelId: Snowflake, guildId: Snowflake) => {
  const db = container.db.em.fork();
  const guildSettings = await db.findOne(Settings, { guildId });
  const settings = guildSettings || new Settings();
  settings.guildId = guildId;
  if (settings.supportChannels) settings.supportChannels = settings.supportChannels.filter((c) => c !== channelId);
  await db.persist(settings).flush();
  container.settings.set(guildId, settings);
};
