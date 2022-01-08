import { ApplyOptions } from '@sapphire/decorators';
import { CommandStore, Command, CommandOptions, Args } from '@sapphire/framework';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import type { Message } from 'discord.js';
import details from '../../lib/details';
import { helpEmbed } from '../../lib/embeds';

@ApplyOptions<CommandOptions>({
  name: 'help',
  description: 'Get a list of all or details about a single command!',
  category: 'Utility',
  syntax: '[command]',
  detailedDescription: details.help
})
export class HelpCommand extends Command {
  public async messageRun(message: Message, args: Args) {
    const command = args.finished ? 'all' : await args.pick('string');
    const commandStore = this.store as CommandStore;
    const commandsList = commandStore.values();
    const prefix = this.container.client.fetchPrefix(message)!;

    if (command === 'all') {
      const commands: { [key: string]: CommandOptions[] } = {};

      for (const command of commandsList) {
        const result = await command.preconditions.run(message, command, {
          external: true
        });
        if (result.success)
          if (Object.keys(commands).includes(command.options.category))
            commands[command.options.category].push(command.options);
          else commands[command.options.category] = [command.options];
      }

      const helpMessage = new PaginatedMessage();
      const categories = Object.keys(commands).sort();

      helpMessage.setSelectMenuOptions((pageIndex) => ({
        label: `${categories[pageIndex - 1]} Commands`,
        description: `Page: ${pageIndex}`
      }));

      for (const category of categories)
        helpMessage.addPageEmbed((e) =>
          helpEmbed(`${category} Commands`, e).setFields(
            commands[category].map((c) => ({
              name: prefix + c.name!,
              value: c.description!,
              inline: false
            }))
          )
        );

      return helpMessage.run(message);
    } else {
      const searched = commandStore.find(
        (c) => c.options.name === command.toLowerCase() || (c.options.aliases || []).includes(command.toLowerCase())
      );
      if (!searched) return message.channel.send('This command was not found.');
      else {
        const options = searched.options;
        const embed = helpEmbed(`${options.name} Command`)
          .addField('Category', options.category + ' Commands')
          .addField('description', options.description!);

        if (options.aliases) embed.addField('Aliases', options.aliases.map((a) => `\`${a}\``).join(', '));

        let syntax = prefix + options.name!;
        if (options.syntax) syntax += ' ' + options.syntax;

        embed.addField('Syntax', '```\n' + syntax + '\n```');
        if (options.detailedDescription) {
          const finalDetails = [];
          let current = '';
          const detailed = options.detailedDescription.split('\n');
          for (const detailedLine of detailed)
            if (current.length + detailedLine.length > 1000) {
              finalDetails.push(current);
              current = detailedLine;
            } else current += '\n' + detailedLine;
          if (current.length > 0) finalDetails.push(current);

          for (const detail of finalDetails) embed.addField('Details', detail);
        }

        return message.channel.send({ embeds: [embed] });
      }
    }
  }
}
