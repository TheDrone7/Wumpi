import { container } from '@sapphire/framework';
import type { Snowflake } from 'discord.js';
import { Notes } from '../entities/Note';

export const addNote = (user: Snowflake, guild: Snowflake, note: string) => {
  const db = container.db.em.fork();
  const newWarning = new Notes();
  newWarning.userId = user;
  newWarning.guildId = guild;
  newWarning.note = note;
  return db.persistAndFlush([newWarning]);
};

export const getNotes = async (userId: Snowflake, guildId: Snowflake) => {
  const db = container.db.em.fork();
  const notes = await db.find(Notes, { userId, guildId });
  const warnings = [];
  for (const noteObject of notes) {
    const { id, note } = noteObject;
    const user = await container.client.users.fetch(userId);
    warnings.push({ id, user, note });
  }
  return warnings;
};

export const deleteNote = async (id: number, guildId: Snowflake) => {
  const db = container.db.em.fork();
  const note = await db.findOne(Notes, { id });
  if (!note) return { success: false, error: 'The specified note does not exist.' };
  if (!(note.guildId === guildId))
    return { success: false, error: 'Insufficient permissions, note from another guild.' };

  try {
    await db.removeAndFlush([note]);
    return { success: true, note };
  } catch (e) {
    container.logger.error(e);
    return { success: false, error: 'An error occurred while deleting the note.' };
  }
};
