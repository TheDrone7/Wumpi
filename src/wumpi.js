const Discord = require('discord.js');
const {prefix, token} = require('./config.json');
const client = new Discord.Client();
const commandHandler = require('./commandHandler');
const messageHandler = require('./messageHandler');

client.on('ready', () => {
    console.log('The bot is ready!');
    client.user.setActivity(client.guilds.size + ' Servers | ' + prefix + 'help', {type: 'LISTENING'});
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) {
        messageHandler.messageHandler(message);
    } else {
        commandHandler.commandHandler(message);
    }
});

/* Bot authorization **/
// noinspection JSIgnoredPromiseFromCall
client.login(token);