const Discord = require("discord.js");

module.exports = {
    name: 'ban',
    description: 'Bans the user specified with reason.',
    aliases: ['🔨', 'ba', 'bann'],
    permissionsRequired: ['BAN_MEMBERS'],
    usage: '[command name] @User "Reason"',
    args: true,
    guildOnly: true,
    /** Simple ban command with a reason in Embedded form
     *
     * @param args {mentions.users.first} - First argument, if it's a user
     * @param message {Discord.Message} - Anything after the first argument
     * @param client {Discord.Client}
     * returns channel message {Discord.RichEmbed}
     * returns dm{Discord.RichEmbed}
     * */
    execute(client, message, args) {
        const taggedUser = message.mentions.members.first();
        if(!taggedUser) return message.channel.send('You didnt tag a user!');
        const reason = args.slice(1).join(" ");
        if(!reason) return message.channel.send('Enter a reason!');
        let banEmbed = new Discord.RichEmbed()
            .setTimestamp(new Date())
            .setColor("0xfc0a2e")
            .setTitle('Player Banned - ' + taggedUser.user.username)
            .setThumbnail('https://i.imgur.com/RBF518F.jpg')
            .setDescription("Banned from " + message.channel.guild.name + '\n\n' + "Reason: " + reason + '\n\n')
            .setFooter(message.author.username + "on guild: " + message.guild.name);
        taggedUser.send('loading').then((msg) => {
            msg.edit(banEmbed)
            .then(() => console.log('edited message'))
            .catch(e => console.log(e));
        }).catch(e => console.log(e));
        taggedUser.ban(reason)
        .then(() => console.log("banned member"))
        .catch(e => console.log(e));
        message.channel.send(banEmbed).catch(e => console.log(e));

        client.guilds.array().filter(guild => guild.id !== message.guild.id && guild.members.find(member => member.id === taggedUser.id)).forEach(guild => {
            const owner = guild.owner;
            if(owner) {
                owner.send("loading...")
                .then((msg) => msg.edit(banEmbed).catch(console.error()))
                .catch(console.error())
            }
        });
    }
};