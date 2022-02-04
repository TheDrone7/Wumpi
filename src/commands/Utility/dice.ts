import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions, Args } from '@sapphire/framework';
import type { Message } from 'discord.js';

@ApplyOptions<CommandOptions>({
  name: 'dice',
  description: 'Roll a dice and get a random result!',
  syntax: '[size]',
  category: 'Utility'
})
export class DiceCommand extends Command {
  public async messageRun(message: Message, args: Args) {
    const size = await args.pick('number').catch(() => 6);
    const result = Math.floor(Math.random() * size);
    return message.reply(`Rolled a dice of size ${size}, and you got a ${result}!`);
  }
}
