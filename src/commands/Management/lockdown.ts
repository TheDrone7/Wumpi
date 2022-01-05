import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions, Args } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { Duration } from '@sapphire/time-utilities';
import { Permission, Lockdown } from '../../database';

@ApplyOptions<CommandOptions>({
  name: 'lockdown',
  description: 'Start a lockdown in your server!',
  category: 'Management',
  syntax: '[timer]',
  runIn: 'GUILD_ANY',
  cooldownDelay: 300_000,
  requiredUserPermissions: ['MANAGE_GUILD'],
  requiredClientPermissions: ['MANAGE_GUILD', 'MANAGE_CHANNELS']
})
export class LockdownCommand extends Command {
  public async messageRun(message: Message, args: Args) {
    const db = this.container.db.em.fork();
    let length = args.finished ? '1h' : await args.pick('string');
    let duration = new Duration(length).offset;

    if (isNaN(duration)) {
      length = '1 hour';
      duration = 3600_000;
    }

    const channels = await message.guild!.channels.fetch();
    for (const channel of channels.values()) {
      const overwrite = new Permission();
      overwrite.id = channel.id;
      overwrite.perms = JSON.stringify(
        channel.permissionOverwrites.cache.toJSON()
      );
      db.persist(overwrite);
      await channel.permissionOverwrites.set(
        [
          {
            id: message.guild!.id,
            deny: [
              'SEND_MESSAGES',
              'CONNECT',
              'SPEAK',
              'CREATE_PRIVATE_THREADS',
              'CREATE_PUBLIC_THREADS',
              'USE_PRIVATE_THREADS',
              'USE_PUBLIC_THREADS',
              'USE_APPLICATION_COMMANDS'
            ]
          }
        ],
        'Lockdown initiated'
      );
    }

    const lockdown = new Lockdown();
    lockdown.guildId = message.guild!.id;
    lockdown.endTime = Date.now() + duration;
    db.persist(lockdown);

    await db.flush();
    this.container.tasks.create('unlock', message.guild!.id, duration);

    return message.channel.send(`Lockdown has been initiated for ${length}.`);
  }
}
