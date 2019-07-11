const Discord = require("discord.js");

module.exports = {
    name: 'mute',
    description: 'Prevents the user from talking in the channel until unmuted.',
    aliases: ['nochat'],
    permissionsRequired: ['MUTE_MEMBERS'],
    usage: '[command name] @User "Reason"',
    args: true,
    guildOnly: true,
    async execute(client, message, args) {
        if (!message.mentions.users.size) {
            return message.reply('You need to tag a user to mute them.');
        }
        const taggedUser = message.mentions.members.first();
        const reason = args.slice(1).join(" ");

        var role = await message.guild.roles.find(role => role.name === "muted");

        if (!role) {

            role = await message.guild.createRole({name: "muted"}).then((_role) => {

                message.guild.channels.forEach(channel => {

                    channel.overwritePermissions(_role, {
                        "SEND_MESSAGES": false,
                        "ADD_REACTIONS": false
                    })
                        .then(() => console.log('channel overwritten'))
                        .catch(e => console.log(e));
                });
                taggedUser.addRole(_role)
                    .then(() => console.log('Added role'))
                    .catch(e => console.log(e));


            }).catch(e => console.log(e));
        }
        taggedUser.addRole(role)
            .then(() => console.log('Added role'))
            .catch(e => console.log(e));

        message.channel.send(`${taggedUser} got muted for ${reason}`).then(() => console.log('message created')).catch(e => console.log(e));
    }
};