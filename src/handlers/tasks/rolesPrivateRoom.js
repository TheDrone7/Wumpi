const Discord = require("discord.js");
const { Roles } = require('../privateRoomProperties/roles.js');

module.exports = {
    name: 'proles',
    description: 'Sends a list of all roles and their permissions',
    aliases: [],
    permissionsRequired: null,
    usage: 'None',
    args: false,
    guildOnly: true,
    /**
     * @param message {Discord.Message}
     * @param args {String[]}
     * @param client {Discord.Client}
     * @returns {Promise<Message | Message[]> | *}
     */
    execute(client, message, args) {
        const embed = new Discord.RichEmbed()
        .setAuthor(client.user.username, client.user.displayAvatarURL)
        .setDescription("List of all roles we added for private rooms")
        .setColor("0xffa500");

        Object.keys(Roles).forEach((key) => {
          embed.addField(key, Roles[key].map(value => {
            return value.toLowerCase();
          }))
        })

        message.author.send("loading...")
        .then((msg => {
          msg.edit(embed)
          .catch(console.error());
        }))
        .catch(console.error());
    }
};