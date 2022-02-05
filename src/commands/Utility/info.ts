import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';
import { embed } from '../../lib/info';
import type { Message } from 'discord.js';

@ApplyOptions<CommandOptions>({
  name: 'info',
  description: 'Information about the bot and the server!',
  category: 'Utility',
  runIn: 'GUILD_ANY'
})
export class InfoCommand extends Command {
  public async messageRun(message: Message) {
    const msg = await message.channel.send('Fetching info...');

    const guild = message.guild!;
    const memberCount = guild.memberCount;
    const bots = guild.members.cache.filter((m) => m.user.bot).size;
    const humans = memberCount - bots;

    const info = embed(memberCount, humans, bots);

    return msg.edit({ embeds: [info], content: null });
  }
}
