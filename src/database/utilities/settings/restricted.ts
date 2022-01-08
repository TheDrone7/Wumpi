import { Settings } from '../../index';
import { container } from '@sapphire/framework';

export const setChannelType = async (channelId: string, guildId: string, kind: string) => {
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

  settings.supportCategory = channelId;
  await db.persist(settings).flush();
};

export const removeChannelType = async (channelId: string, guildId: string, kind: string) => {
  const db = container.db.em.fork();
  const guildSettings = await db.findOne(Settings, { guildId });
  const settings = guildSettings || new Settings();
  settings.guildId = guildId;
  if (kind === 'user') if (settings.userOnly) settings.userOnly = settings.userOnly.filter((c) => c !== channelId);
  if (kind === 'suggestions')
    if (settings.suggestions) settings.suggestions = settings.suggestions.filter((c) => c !== channelId);

  settings.supportCategory = channelId;
  await db.persist(settings).flush();
};
