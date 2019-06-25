const {key} = require('./config.json');
const Cleverbot = require('cleverbot-node');
const cleverbot = new Cleverbot;
cleverbot.configure({botapi: key});

exports.messageHandler = function (message) {
    if (message.author.bot) return;
    if (message.channel.type === "dm") {
        cleverbot.write(message.content, (response) => {
            message.channel.startTyping();
            setTimeout(() => {
                message.channel.send(response.output).catch(console.error);
                message.channel.stopTyping();
            }, Math.random() * (1 - 3) + 1 * 1000);
        });
    }
};