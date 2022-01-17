import type { Args } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { type Message, MessageEmbed } from 'discord.js';
import details from '../../lib/details';
import { SubCommandPluginCommand } from '@sapphire/plugin-subcommands';
import { colors } from '../../lib/constants';
import { addNote, deleteNote, getNotes } from '../../database/utilities/notes';

@ApplyOptions<SubCommandPluginCommand.Options>({
  name: 'note',
  aliases: ['notes'],
  description: "Manage a user's moderator notes in your server!",
  category: 'Moderation',
  syntax: '<(add)|(remove|delete)|(show|view)> (<member> [note])|(<id>)|(<member>)',
  runIn: 'GUILD_ANY',
  cooldownDelay: 5_000,
  detailedDescription: details.note,
  requiredUserPermissions: ['MODERATE_MEMBERS'],
  requiredClientPermissions: ['MODERATE_MEMBERS'],
  subCommands: ['add', 'remove', 'delete', 'show', 'view']
})
export class NotesCommand extends SubCommandPluginCommand {
  public async add(message: Message, args: Args) {
    const member = await args.pick('member').catch(() => {
      message.reply('Please provide a user to add a note to.');
    });
    const reason = args.finished ? 'No reason.' : await args.rest('string');

    if (!member) return;
    const guild = message.guild!;

    try {
      await addNote(member.id, guild.id, reason);
    } catch (e) {
      this.container.logger.error(e);
      return message.reply('There was an error while adding the note.');
    }

    return message.channel.send(`Added note for ${member.user.tag}.`);
  }

  public async remove(message: Message, args: Args) {
    const id = await args.pick('number').catch(() => {
      message.reply('Please provide a note ID to delete.');
    });

    if (!id) return;

    const guild = message.guild!;

    const { success, error } = await deleteNote(id, guild.id);

    if (!success) return message.reply(error!);
    return message.reply(`Note with ID ${id} has been deleted.`);
  }

  public async delete(message: Message, args: Args) {
    return this.remove(message, args);
  }

  public async show(message: Message, args: Args) {
    const member = await args.pick('member').catch(() => {
      message.reply('Please provide a user to view notes of.');
    });

    if (!member) return;
    const guild = message.guild!;

    let notes = [];

    try {
      notes = await getNotes(member.id, guild.id);
    } catch (e) {
      this.container.logger.error(e);
      return message.reply('There was an error while getting the warnings of the user.');
    }

    const executor = message.author;
    const embed = new MessageEmbed();
    embed
      .setTitle('Notes of ' + member.user.tag)
      .setColor(colors.blurple)
      .setThumbnail(member.user.displayAvatarURL())
      .setFooter({ text: `By ${executor.tag}`, iconURL: executor.displayAvatarURL() })
      .setTimestamp();

    for (const note of notes) embed.addField('Note #' + note.id, note.note);

    return message.channel.send({ embeds: [embed] });
  }

  public async view(message: Message, args: Args) {
    return this.show(message, args);
  }
}
