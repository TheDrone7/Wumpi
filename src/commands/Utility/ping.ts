import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';

@ApplyOptions<CommandOptions>({
  name: 'ping',
  description: 'Ping Pong!',
  category: 'Utility'
})
export class PingCommand extends Command {
  public async messageRun(message: Message) {
    const msg = await message.channel.send('Pinging...');

    const content = `Pong! WS Latency: \`${this.container.client.ws.ping}ms\`. API latency: \`${
      msg.createdTimestamp - message.createdTimestamp
    }ms\`.`;

    return msg.edit(content);
  }
}
