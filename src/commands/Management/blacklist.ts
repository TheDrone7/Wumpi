import type { Args } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import type { Message } from 'discord.js';
import details from '../../lib/details';
import { SubCommandPluginCommand } from '@sapphire/plugin-subcommands';
import { blacklist } from '../../database/utilities/automod';

@ApplyOptions<SubCommandPluginCommand.Options>({
  name: 'blacklist',
  aliases: ['banned-words'],
  description: 'Manage the blacklisted words in your server!',
  category: 'Management',
  syntax: '<(add)|(remove|delete)|(show|view)> [word]',
  runIn: 'GUILD_ANY',
  cooldownDelay: 5_000,
  detailedDescription: details.blacklist,
  requiredUserPermissions: ['ADMINISTRATOR'],
  requiredClientPermissions: ['ADMINISTRATOR'],
  subCommands: ['add', 'remove', 'delete', 'show', 'view', { input: 'default', default: true }]
})
export class BlackListCommand extends SubCommandPluginCommand {
  public default(message: Message) {
    return message.reply('Please specify a valid action - `add`, `remove`, `delete`, `show`, `view`.');
  }

  public async add(message: Message, args: Args) {
    const word = await args.pick('string');

    if (!word) return message.reply('Please specify the word you want to add to the blacklist.');

    try {
      await blacklist(word, message.guild!.id, 'add');
    } catch (e) {
      this.container.logger.error(e);
      return message.reply('There was an error while adding the word to the list.');
    }

    return message.channel.send(`Added \`${word}\` to the blacklist.`);
  }

  public async remove(message: Message, args: Args) {
    const word = await args.pick('string');

    if (!word) return message.reply('Please specify the word you want to remove from the blacklist.');

    try {
      await blacklist(word, message.guild!.id, 'remove');
    } catch (e) {
      this.container.logger.error(e);
      return message.reply('There was an error while removing the word from the list.');
    }

    return message.channel.send(`Removed \`${word}\` from the blacklist.`);
  }

  public async delete(message: Message, args: Args) {
    return this.remove(message, args);
  }

  public async show(message: Message) {
    const automod = this.container.automod.get(message.guild!.id);

    let list = automod?.blacklist;
    if (!list)
      try {
        list = await blacklist('', message.guild!.id, 'view');
      } catch (e) {
        this.container.logger.error(e);
        return message.reply('There was an error while getting the list.');
      }

    list = list.map((s) => `- \`${s}\``);
    if (list && list.length) return message.channel.send(`Here is the list:\n${list.join('\n')}`);
    else return message.channel.send('There are no blacklisted words in the server');
  }

  public async view(message: Message) {
    return this.show(message);
  }
}
