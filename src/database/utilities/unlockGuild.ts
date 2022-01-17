import { container } from '@sapphire/framework';
import { Lockdowns, Permissions } from '../index';
import type { Snowflake } from 'discord.js';

export const unlockGuild = async (guildId: Snowflake, force: boolean = false) => {
  const guild = await container.client.guilds.fetch(guildId);
  const db = container.db.em.fork();
  const lockdown: Lockdowns | null = await db.findOne(Lockdowns, {
    guildId
  });
  if (lockdown === null) return 'No lockdown';
  if (lockdown.endTime < Date.now() || force) {
    const channels = await guild.channels.fetch();
    for (const channel of channels.values()) {
      const perm: Permissions | null = await db.findOne(Permissions, {
        id: channel.id
      });
      if (perm !== null) {
        await channel.permissionOverwrites.set(JSON.parse(perm.perms));
        db.remove(perm);
      }
    }
  }
  await db.remove(lockdown).flush();
  return true;
};
