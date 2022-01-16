import { Args, Command, CommandOptions } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { Message, MessageEmbed, TextChannel } from 'discord.js';
import { colors } from '../../lib/constants';

@ApplyOptions<CommandOptions>({
  name: 'echo',
  description: 'Repeats the message specified by the command user.',
  category: 'Server Management',
  runIn: 'GUILD_ANY',
  flags: ['embed'],
  syntax: '[--embed] [channel] <message>',
  requiredUserPermissions: ['ADMINISTRATOR']
})
export class EchoCommand extends Command {
  async messageRun(message: Message, args: Args) {
    const useEmbed = args.getFlags('embed');
    const channel = (await args.pick('channel').catch(() => message.channel)) as TextChannel;
    const msg = args.finished ? undefined : await args.rest('string');
    if (!msg) return message.reply('You must specify a message to repeat.');

    return useEmbed
      ? channel.send({
          embeds: [
            new MessageEmbed()
              .setDescription(msg)
              .setColor(colors.blurple)
              .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
          ]
        })
      : channel.send(msg);
  }
}
