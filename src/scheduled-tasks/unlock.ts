import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';
import type { PieceContext } from '@sapphire/framework';
import { unlockGuild } from '../database/';
import type { Snowflake } from 'discord.js';

export class UnlockTask extends ScheduledTask {
  public constructor(context: PieceContext) {
    super(context, {
      name: 'unlock'
    });
  }

  public async run(guildId: Snowflake) {
    await unlockGuild(guildId);
  }
}
