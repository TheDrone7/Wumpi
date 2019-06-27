const fs = require('fs');
const Discord = require('discord.js');
const {Permissions} = require('discord.js');
const {client} = require('../wumpi.js');
const guildSettings = require('../lib/guilddb');
client.commands = new Discord.Collection();
/* Dynamic storing of commands.*/
const commandFiles = fs.readdirSync('./handlers/tasks/').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./tasks/${file}`);
    /**
     *  Sets up commands for the client
     *
     *  @param {String} command.name commands default name
     *  @param {String} command the actual command
     */
    client.commands.set(command.name, command);
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
            if (message.content.startsWith(guild.variables.prefix) || message.author.bot) {
                if (err) console.error(err);
                const args = message.content.slice(guild.variables.prefix.length).split(' '[0]);
                const commandName = args.shift().toLowerCase();

                const command = client.commands.get(commandName)
                    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

                if (!command) return;

                if (command.permissionsRequired && !(message.channel.type === "dm")) {
                    let permissions = new Permissions(command.permissionsRequired);
                    if (!message.member.hasPermission(permissions.toArray())) {
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
                    command.execute(message, args);
                } catch (error) {
                    console.error(error);
                    message.reply('Error executing command!');
                }
            }
        });
    }
});