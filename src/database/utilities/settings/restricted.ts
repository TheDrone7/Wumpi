import { Settings } from '../../index';
import { container } from '@sapphire/framework';
import type { Snowflake } from 'discord.js';

type restrictedChannelKind = 'user' | 'suggestions' | 'bot';

export const setChannelType = async (channelId: Snowflake, guildId: Snowflake, kind: restrictedChannelKind) => {
  const db = container.db.em.fork();
  const guildSettings = await db.findOne(Settings, { guildId });
  const settings = guildSettings || new Settings();
  settings.guildId = guildId;
  if (kind === 'user')
    if (settings.userOnly) settings.userOnly.push(channelId);
    else settings.userOnly = [channelId];
  if (kind === 'suggestions')
    if (settings.suggestions) settings.suggestions.push(channelId);
    else settings.suggestions = [channelId];
  if (kind === 'bot') settings.botChannel = channelId;

  settings.supportCategory = channelId;
  await db.persist(settings).flush();
  container.settings.set(guildId, settings);
};

export const removeChannelType = async (channelId: Snowflake, guildId: Snowflake, kind: restrictedChannelKind) => {
  const db = container.db.em.fork();
  const guildSettings = await db.findOne(Settings, { guildId });
  const settings = guildSettings || new Settings();
  settings.guildId = guildId;
  if (kind === 'user') if (settings.userOnly) settings.userOnly = settings.userOnly.filter((c) => c !== channelId);
  if (kind === 'suggestions')
    if (settings.suggestions) settings.suggestions = settings.suggestions.filter((c) => c !== channelId);
  if (kind === 'bot') if (settings.botChannel) settings.botChannel = undefined;

  settings.supportCategory = channelId;
  await db.persist(settings).flush();
  container.settings.set(guildId, settings);
};
