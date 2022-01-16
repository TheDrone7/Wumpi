import { container } from "@sapphire/framework";
import {Warnings} from "../entities/Warning";

export const warnUser = (user: string, moderator: string, guild: string, reason: string) => {
  const db = container.db.em.fork();
  const newWarning = new Warnings();
  newWarning.userId = user;
  newWarning.moderatorId = moderator;
  newWarning.guildId = guild;
  newWarning.reason = reason;
  return db.persistAndFlush([newWarning]);
};

export const getWarnings = async (userId: string, guildId: string) => {
  const db = container.db.em.fork();
  const warns = await db.find(Warnings, { userId, guildId });
  const warnings = [];
  for (const warn of warns) {
    const { id, reason } = warn;
    const user = await container.client.users.fetch(userId);
    const moderator = await container.client.users.fetch(warn.moderatorId);
    warnings.push({id, user, moderator, reason});
  }
  return warnings;
}