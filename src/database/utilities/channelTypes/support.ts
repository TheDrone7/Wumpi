import { Settings } from '../../index';
import { container } from '@sapphire/framework';

export const setSupportCategory = async (
  channelId: string | undefined,
  guildId: string
) => {
  const db = container.db.em.fork();
  const guildSettings = await db.findOne(Settings, { guildId });
  const settings = guildSettings || new Settings();
  settings.guildId = guildId;
  settings.supportCategory = channelId;
  await db.persist(settings).flush();
};

export const addSupportChannel = async (channelId: string, guildId: string) => {
  const db = container.db.em.fork();
  const guildSettings = await db.findOne(Settings, { guildId });
  const settings = guildSettings || new Settings();
  settings.guildId = guildId;
  if (settings.supportChannels) settings.supportChannels.push(channelId);
  else settings.supportChannels = [channelId];
  await db.persist(settings).flush();
};

export const delSupportChannel = async (channelId: string, guildId: string) => {
  const db = container.db.em.fork();
  const guildSettings = await db.findOne(Settings, { guildId });
  const settings = guildSettings || new Settings();
  settings.guildId = guildId;
  if (settings.supportChannels)
    settings.supportChannels = settings.supportChannels.filter(
      (c) => c !== channelId
    );
  await db.persist(settings).flush();
};
