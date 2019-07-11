const fs = require('fs');
const Discord = require('discord.js');
const {Permissions} = require('discord.js');
const client = require('../wumpi.js');
const guildSettings = require('../lib/guilddb');
const Collection = new Discord.Collection();
const MessageHandler = require('./messageHandler.js');
/* Dynamic storing of commands.*/
const commandFiles = fs.readdirSync('/app/src/handlers/tasks/').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./tasks/${file}`);
    /**
     *  Sets up commands for the client
     *
     *  @param {String} command.name commands default name
     *  @param {String} command the actual command
     */
    Collection.set(command.name, command);
}

/** Cooldown collection */
const cooldowns = new Discord.Collection();

client.on('message', async message => {
    if (message.channel.type !== "dm") {
        let currentGuildID = message.channel.guild.id;
        guildSettings.findOne({
            id: currentGuildID
        }, (err, guild) => {
            if (err) console.error(err);
            var code = CheckChannelType(message, guild, client);
            if (message.content.startsWith(guild.variables.prefix)) {
                if (err) return console.error(err);
                const args = message.content.slice(guild.variables.prefix.length).split(' '[0]);
                const commandName = args.shift().toLowerCase();

                if (code === 1) {
                    if (commandName !== "textonly") {
                        message.channel.send(`You cant use commands here, besides 'textonly', because its a user channel!`)
                            .then((msg) => msg.delete(5000))
                            .catch(e => console.log(e));

                        message.delete().catch(e => console.log(e));
                    }
                } else if (code === 2)
                    return console.log('image only');

                const command = Collection.get(commandName)
                    || Collection.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

                if (!command) return;

                if (command.permissionsRequired && !(message.channel.type === "dm")) {
                    let permissions = new Permissions(command.permissionsRequired);
                    if (!message.member.hasPermission(permissions)) {
                        return message.reply('You don\'t have enough permissions to run that command! You need permissions `' + permissions.toArray() + '` to run that command.');
                    }
                }

                if (command.guildOnly && message.channel.type !== 'text') {
                    return message.reply('I can\'t execute that command inside a dm!');
                }

                if (command.args && !args.length) {
                    let reply = `You didn't provide any arguments, ${message.author}!`;

                    if (command.usage) {
                        reply += `\nThe proper usage would be: \`${guild.variables.prefix}${command.name} ${command.usage}\``;
                    }

                    return message.channel.send(reply);
                }

                if (!cooldowns.has(command.name)) {
                    cooldowns.set(command.name, new Discord.Collection());
                }

                const now = Date.now();
                const timestamps = cooldowns.get(command.name);
                const cooldownAmount = (command.cooldown || 3) * 1000;

                if (timestamps.has(message.author.id)) {
                    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

                    if (now < expirationTime) {
                        const timeLeft = (expirationTime - now) / 1000;
                        return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
                    }
                }
                timestamps.set(message.author.id, now);
                setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

                /** Command execution */
                try {
                    command.execute(client, message, args);
                } catch (error) {
                    console.error(error);
                    message.reply('Error executing command!');
                }
            }
        });
    } else if (message.channel.type === "dm") {
        MessageHandler(message);
    }
});

function CheckChannelType(message, guildOptions) {
    //we need to require it each call, otherwise the client returns null, because we export it as null (its not logged in)
    if (message.author.id === client.user.id)
        return;

    var isImageChannel = guildOptions.channels.imageOnlyChannelIDs.find(c => c === message.channel.id);
    if (isImageChannel) {
        var cont = message.content;

        if (!cont.includes('.jpg') && !cont.includes('.jpeg') && !cont.includes('.png') && !cont.includes('.gif') && !cont.includes('https')) {

            if (message.attachments.array().length <= 0) {
                message.channel.send('This is an image only channel, you must use an url which redirects the user to an image or attach an image file!').then((msg) => {
                    msg.delete(5000);
                }).catch(e => console.log(e));
                message.delete().catch(e => console.log(e));

            } else if (message.attachments.array().length > 0) {

                var WRONG_FILE_FORMAT = false;
                message.attachments.forEach(attachment => {
                    var cont = attachment.filename;
                    if (!cont.includes('.jpg') && !cont.includes('.jpeg') && !cont.includes('.png') && !cont.includes('.gif'))
                        WRONG_FILE_FORMAT = true;
                });

                if (WRONG_FILE_FORMAT) {
                    message.channel.send('One of your attached files isnt a image file').then((msg) => {
                        msg.delete(5000);
                    }).catch(e => console.log(e));
                    message.delete().catch(e => console.log(e));

                }
            }
        }
        return 2;
    }

    var isBotChannel = guildOptions.channels.botOnlyChannelIDs.find(c => c === message.channel.id);
    if (isBotChannel) {
        const args = message.content.slice(guildOptions.variables.prefix.length).split(' '[0]);

        if (!message.content.startsWith(guildOptions.variables.prefix)) {

            message.channel.send('This is an bot channel, you can only send commands of the bot there!').then(_msg => {
                console.log(_msg.id);
                _msg.delete(5000).then(() => console.log('deleted bot message')).catch(e => console.log(e));
            }).catch(e => console.log(e));
            message.delete().then(() => console.log('deleted user message')).catch(e => console.log(e));

        } else {

            const commandName = args.shift().toLowerCase();
            const command = Collection.get(commandName) || Collection.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
            if (!command) {
                message.channel.send('This is an bot channel, you can only send commands of the bot there!').then(_msg => {
                    _msg.delete(5000).then(() => console.log('deleted bot message')).catch(e => console.log(e));
                }).catch(e => console.log(e));
                message.delete().then(() => console.log('deleted user message')).catch(e => console.log(e));

            }
        }
        return 0;
    }

    var isUserChannel = guildOptions.channels.userOnlyChannelIDs.find(c => c === message.channel.id);
    if (isUserChannel) {
        return 1;
    }
}