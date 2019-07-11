const Discord = require("discord.js");
const guildSettings = require('../../lib/guilddb');
const ticketHandler = require('../ticketHandler.js');
//const {client} = require('../../wumpi.js');
module.exports = {
    name: 'help',
    description: 'List all of my commands or info about a specific command.',
    aliases: ['commands', 'cmds'],
    usage: '[command name]',
    cooldown: 10,
    /**
     * Help message, displays all commands
     *
     * @param message
     * @param args
     * @returns {*}
     */
    execute(client, message, args) {
        let helpEmbed = new Discord.RichEmbed()
            .setTitle('Commands')
            .setTimestamp()
            .setColor(0x02fc62)
            .setThumbnail(client.user.displayAvatarURL)
            .setDescription(
                '-help Lists all of my commands\n' +
                '-about Leaves you an about page, about me!\n' +
                '-avatar Gets the avatar of your user\n' +
                '-ban Bans the user you mention\n' +
                '-new Creates a support ticket\n' +
                '-close Closes a support ticket\n' +
                '-setcategory Sets the category for support tickets\n' +
                '-setprefix Sets my bot prefix\n' +
                '-settopic Sets a tickets topic\n' +
                '-setticketlog Sets the log channel for tickets\n' +
                '-supportrole Sets the support role for tickets\n' +
                '-prune Purges channels\n' +
                '-mute Mutes the user selected\n' +
                '-massunban Unbans all users in the discord\n' +
                '-nsfw Turns on NSFW in the channel\n' +
                '-textonly Makes the channel text only\n' +
                '-imageonly Makes the channel image only\n' +
                '-slowmode Turns on slow mode for the channel\n' +
                '-back Backs up the entire discord\n');

        message.author.send("loading...")
            .catch((e) => {
                if (e) return console.log(e);
            }).then(msg => {
            message.delete()
                .then(() => console.log('deleted message'))
                .catch(e => console.log(e));
            msg.edit(helpEmbed).then((edited) => {
                console.log('working');
            }).catch((e) => console.log(e));
        })
    }
};