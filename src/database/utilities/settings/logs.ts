import { Settings } from '../../index';
import { container } from '@sapphire/framework';
import type { Snowflake } from 'discord.js';

export const setTicketLogs = async (channelId: Snowflake, guildId: Snowflake) => {
  const db = container.db.em.fork();
  const guildSettings = await db.findOne(Settings, { guildId });
  const settings = guildSettings || new Settings();
  settings.guildId = guildId;
  settings.ticketLogs = channelId;
  await db.persist(settings).flush();
};

export const setJoinLogs = async (channelId: Snowflake, guildId: Snowflake) => {
  const db = container.db.em.fork();
  const guildSettings = await db.findOne(Settings, { guildId });
  const settings = guildSettings || new Settings();
  settings.guildId = guildId;
  settings.joinLogs = channelId;
  await db.persist(settings).flush();
};

export const setModeratorLogs = async (channelId: Snowflake, guildId: Snowflake) => {
  const db = container.db.em.fork();
  const guildSettings = await db.findOne(Settings, { guildId });
  const settings = guildSettings || new Settings();
  settings.guildId = guildId;
  settings.moderatorLogs = channelId;
  await db.persist(settings).flush();
};

export const setMessageLogs = async (channelId: Snowflake, guildId: Snowflake) => {
  const db = container.db.em.fork();
  const guildSettings = await db.findOne(Settings, { guildId });
  const settings = guildSettings || new Settings();
  settings.guildId = guildId;
  settings.messageLogs = channelId;
  await db.persist(settings).flush();
};

export const disableLogs = async (kind: 'ticket' | 'join' | 'moderator' | 'message', guildId: Snowflake) => {
  const db = container.db.em.fork();
  const guildSettings = await db.findOne(Settings, { guildId });
  const settings = guildSettings || new Settings();
  settings.guildId = guildId;
  if (kind === 'ticket') settings.ticketLogs = undefined;
  if (kind === 'join') settings.joinLogs = undefined;
  if (kind === 'moderator') settings.moderatorLogs = undefined;
  if (kind === 'message') settings.messageLogs = undefined;
  await db.persist(settings).flush();
};
