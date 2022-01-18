import { Automod } from '../index';
import type { Snowflake } from 'discord.js';
import { container } from '@sapphire/framework';

export const blacklist = async (word: string, guildId: Snowflake, action: 'add' | 'remove' | 'view') => {
  const db = container.db.em.fork();
  let automod = await db.findOne(Automod, {
    guildId
  });
  if (!automod) automod = new Automod();
  automod.guildId = guildId;

  if (action === 'add') automod.blacklist.push(word);
  if (action === 'remove') automod.blacklist = automod.blacklist.filter((w) => w !== word);
  if (action !== 'view') await db.persistAndFlush([automod]);
  container.automod.set(guildId, automod);
  return automod.blacklist;
};

export const ignore = async (guildId: Snowflake, channel: Snowflake, kind: 'bl' | 'rl' | 'spam' | 'inv') => {
  const db = container.db.em.fork();
  let automod = await db.findOne(Automod, {
    guildId
  });
  if (!automod) automod = new Automod();
  automod.guildId = guildId;

  if (kind === 'bl') automod.ignoreBlacklist.push(channel);
  if (kind === 'rl') automod.ignoreRatelimit.push(channel);
  if (kind === 'spam') automod.ignoreSpam.push(channel);
  if (kind === 'inv') automod.ignoreInvite.push(channel);
  await db.persistAndFlush([automod]);
  container.automod.set(guildId, automod);
};

export const limit = async (guildId: Snowflake, kind: 'rlCount' | 'rlTime' | 'caps' | 'emojis', value?: number) => {
  const db = container.db.em.fork();
  let automod = await db.findOne(Automod, {
    guildId
  });
  if (!automod) automod = new Automod();
  automod.guildId = guildId;

  if (kind === 'rlCount') automod.ratelimitCount = value;
  if (kind === 'rlTime') automod.ratelimitDuration = value;
  if (kind === 'caps') automod.capitalsLimit = value;
  if (kind === 'emojis') automod.emojisLimit = value;

  await db.persistAndFlush([automod]);
  container.automod.set(guildId, automod);
};

export const updateStaff = async (guildId: Snowflake, roleId: Snowflake) => {
  const db = container.db.em.fork();
  let automod = await db.findOne(Automod, {
    guildId
  });
  if (!automod) automod = new Automod();
  automod.guildId = guildId;
  automod.staff = roleId;
  await db.persistAndFlush([automod]);
  container.automod.set(guildId, automod);
};
