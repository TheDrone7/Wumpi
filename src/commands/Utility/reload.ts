import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';

@ApplyOptions<CommandOptions>({
  name: 'reload',
  description: 'Reloads all commands of the bot!',
  category: 'Utility',
  preconditions: ['OwnerOnly']
})
export class ReloadCommand extends Command {
  public async messageRun(message: Message) {
    const msg = await message.channel.send('Reloading...');
    for (const store of this.container.stores.values()) {
      await store.unloadAll();
      await store.loadAll();
    }
    msg.edit('Reloaded...');
  }
}
