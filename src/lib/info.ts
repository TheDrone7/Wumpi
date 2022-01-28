import { MessageEmbed } from 'discord.js';
import { container } from '@sapphire/framework';

const about = `ABOUT THE BOT (TODO)`;
const socials = `SOCIALS LIST (TODO)`;
const VERSION = '1.0.0';

export const embed = (member: number, human: number, bots: number) => {
  const info = new MessageEmbed();
  info
    .setTitle(`${container.client.user!.username} (V${VERSION})`)
    .setThumbnail(container.client.user!.displayAvatarURL())
    .addField('ABOUT', about)
    .addField('SOCIALS', socials)
    .addField('STATS', `MEMBERS: ${member}\nHUMANS: ${human}\nBOTS: ${bots}`, true)
    .addField('RUNNING ON', `NodeJS (${process.version})`, true)
    .setFooter({ text: 'As of' })
    .setTimestamp();
  return info;
};
