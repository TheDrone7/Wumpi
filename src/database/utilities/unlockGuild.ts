import { container } from '@sapphire/framework';
import { Lockdown, Permission } from '../index';

export const unlockGuild = async (guildId: string, force: boolean = false) => {
  const guild = await container.client.guilds.fetch(guildId);
  const db = container.db.em.fork();
  const lockdown: Lockdown | null = await db.findOne(Lockdown, {
    guildId
  });
  if (lockdown === null) return 'No lockdown';
  if (lockdown.endTime < Date.now() || force) {
    const channels = await guild.channels.fetch();
    for (const channel of channels.values()) {
      const perm: Permission | null = await db.findOne(Permission, {
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
