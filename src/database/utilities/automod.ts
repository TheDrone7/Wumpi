import { Automod } from '../index';
import type { Snowflake } from 'discord.js';
import { container } from '@sapphire/framework';

type ignoreKind = 'blacklist' | 'ratelimit' | 'spam' | 'invites';

export const blacklist = async (word: string, guildId: Snowflake, action: 'add' | 'remove' | 'view') => {
  const db = container.db.em.fork();
  let automod = await db.findOne(Automod, {
    guildId
  });
  if (!automod) automod = new Automod();
  automod.guildId = guildId;

  if (action === 'add' && !automod.blacklist.includes(word)) automod.blacklist.push(word);
  if (action === 'remove') automod.blacklist = automod.blacklist.filter((w) => w !== word);
  if (action !== 'view') await db.persistAndFlush([automod]);
  container.automod.set(guildId, automod);
  return automod.blacklist;
};

export const ignore = async (guildId: Snowflake, channel: Snowflake, kind: ignoreKind, stop: boolean) => {
  const db = container.db.em.fork();
  let automod = await db.findOne(Automod, {
    guildId
  });
  if (!automod) automod = new Automod();
  automod.guildId = guildId;

  if (kind === 'blacklist')
    if (!stop) automod.ignoreBlacklist.push(channel);
    else automod.ignoreBlacklist = automod.ignoreBlacklist.filter((c) => c !== channel);
  if (kind === 'ratelimit')
    if (!stop) automod.ignoreRatelimit.push(channel);
    else automod.ignoreRatelimit = automod.ignoreRatelimit.filter((c) => c !== channel);
  if (kind === 'spam')
    if (!stop) automod.ignoreSpam.push(channel);
    else automod.ignoreSpam = automod.ignoreSpam.filter((c) => c !== channel);
  if (kind === 'invites')
    if (!stop) automod.ignoreInvite.push(channel);
    else automod.ignoreInvite = automod.ignoreInvite.filter((c) => c !== channel);
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
