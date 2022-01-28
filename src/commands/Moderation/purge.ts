import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions, Args } from '@sapphire/framework';
import type { Collection, Message, Snowflake, TextChannel } from 'discord.js';

@ApplyOptions<CommandOptions>({
  name: 'purge',
  aliases: ['clear'],
  description: 'Clear messages in a channel (optionally by user)!',
  category: 'Moderation',
  syntax: '<number> [--user @User | --bots]',
  runIn: 'GUILD_ANY',
  cooldownDelay: 5000,
  flags: ['user', 'bots'],
  requiredUserPermissions: ['MANAGE_CHANNELS'],
  requiredClientPermissions: ['MANAGE_CHANNELS', 'MANAGE_MESSAGES']
})
export class PurgeCommand extends Command {
  public async messageRun(message: Message, args: Args) {
    const num = await args.pick('number').catch(() => undefined);
    const onlyUser = args.getFlags('user');
    const onlyBots = args.getFlags('bots');
    const channel = <TextChannel>message.channel;
    let toDelete: number | Message[] | Collection<Snowflake, Message> | undefined = num;
    const messages = await channel.messages.fetch({ before: message.id, limit: 100 }, { cache: true, force: false });
    if (onlyUser) {
      console.log('Only user');
      const user = await args.pick('user').catch();
      if (!user) return message.reply('Please specify the user whose messages are to be deleted.');
      toDelete = messages.filter((m) => m.author.id === user.id);
    }
    if (onlyBots) {
      console.log('Only bots');
      toDelete = messages.filter((m) => m.author.bot);
    }

    if (!toDelete || !num) return message.reply('Please specify the number of messages to purge.');
    if (toDelete > 100) return message.reply('Too many to delete. Maximum limit is 100.');
    if (typeof toDelete !== 'number') toDelete = [...toDelete.values()].slice(0, num);

    const deleted = await channel.bulkDelete(toDelete);
    const msg = await message.channel.send(`Deleted ${deleted.size} messages.`);
    return setTimeout(() => msg.delete(), 5000);
  }
}
