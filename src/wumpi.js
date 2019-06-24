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
     *
     */
    client.commands.set(command.name, command);
}

client.on('message', message => {
    /** Actual command handler */
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    if (!client.commands.has(command)) return;
    /** Command execution */
    try {
        client.commands.get(command).execute(message, args);
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
client.login(token);