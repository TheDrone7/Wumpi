import {container } from "@sapphire/framework";
import type {Snowflake, TextChannel, MessageEmbed} from "discord.js";
import {Settings} from "../database";

export const moderatorLog = async (guildId: Snowflake, message: MessageEmbed) => {
  const db = container.db.em.fork();
  const settings = await db.findOne(Settings, { guildId });
  const guild = await container.client.guilds.fetch(guildId);
  if (settings?.moderatorLogs) {
    const logsChannel = (await guild.channels.fetch(settings.moderatorLogs)) as TextChannel;
    await logsChannel.send({ embeds: [message] });
  }
}