import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';
import type { PieceContext } from '@sapphire/framework';
import { unlockGuild } from '../lib/utils';

export class UnlockTask extends ScheduledTask {
  public constructor(context: PieceContext) {
    super(context, {
      name: 'unlock'
    });
  }

  public async run(guildId: string) {
    await unlockGuild(guildId);
  }
}
