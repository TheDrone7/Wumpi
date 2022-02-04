import type { Args } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { type Message, MessageEmbed } from 'discord.js';
import details from '../../lib/details';
import { SubCommandPluginCommand } from '@sapphire/plugin-subcommands';
import { setChannel, setImage, setMessage } from '../../database';

@ApplyOptions<SubCommandPluginCommand.Options>({
  name: 'welcome',
  description: 'Configure new server member welcome messages',
  category: 'Management',
  syntax: '<channel|message|image> <#channel>|<some-random-message>',
  runIn: 'GUILD_ANY',
  cooldownDelay: 5_000,
  detailedDescription: details.welcome,
  requiredUserPermissions: ['ADMINISTRATOR'],
  requiredClientPermissions: ['ADMINISTRATOR'],
  subCommands: ['channel', 'message', 'image', { input: 'default', default: true }]
})
export class WelcomeCommand extends SubCommandPluginCommand {
  public default(message: Message) {
    return message.reply('Please specify a valid option - `channel`, `message`.');
  }

  public async channel(message: Message, args: Args) {
    const channel = await args.pick('channel').catch(async () => await args.pick('string').catch(() => undefined));
    if (!channel) return message.reply('Please specify where to welcome the user, or if you want to disable it.');

    if (typeof channel === 'string' && channel.toLowerCase() !== 'dm' && channel.toLowerCase() !== 'disable')
      return message.reply('Valid options other than channels are - `dm` and `disable`.');

    try {
      if (typeof channel === 'string') await setChannel(message.guild!.id, channel);
      else await setChannel(message.guild!.id, channel.id);
    } catch (e) {
      await this.container.logger.error(e);
      return message.reply('Unable to change the welcome channel');
    }

    if (channel === 'disable') return message.channel.send('Disabled welcome messages.');
    else return message.channel.send(`Set the welcome messages channel to ${channel.toString()}`);
  }

  public async message(msg: Message, args: Args) {
    const welcome = args.finished ? undefined : await args.rest('string');
    if (!welcome) return msg.reply('Please specify a welcome message.');

    try {
      await setMessage(msg.guildId!, welcome);
    } catch (e) {
      this.container.logger.error(e);
      return msg.reply('There was an error while updating welcome message.');
    }

    return msg.channel.send('Updated the welcome message to-\n```\n' + welcome + '```');
  }

  public async image(msg: Message, args: Args) {
    const image = args.finished ? undefined : await args.pick('string');
    if (!image) return msg.reply('Please share a link to the image you want to use.');

    try {
      await setImage(msg.guildId!, image);
    } catch (e) {
      this.container.logger.error(e);
      return msg.reply('There was an error while updating welcome image.');
    }

    const imageEmbed = new MessageEmbed().setImage(image);
    return msg.channel.send({ content: 'Updated the welcome image.', embeds: [imageEmbed] });
  }
}
