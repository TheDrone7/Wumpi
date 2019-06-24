const fs = require('fs');
const Discord = require('discord.js');
const {prefix, token} = require('./config.json');
const client = new Discord.Client();
client.commands = new Discord.Collection();

/* Dynamic storing of commands.*/
const commandFiles = fs.readdirSync('./tasks').filter(file => file.endsWith('.js'));

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

client.on('message', message => {
    /** Actual command handler */
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(' '[0]);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply('I can\'t execute that command inside DMs!');
    }

    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
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
});

client.once('ready', () => {
    console.log('The bot is ready!');
});

/* Bot authorization **/
// noinspection JSIgnoredPromiseFromCall
client.login(process.env.TOKEN);