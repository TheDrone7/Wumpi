const {cleverbot_key} = require('../config.json');
const client = require('../wumpi.js');
const Cleverbot = require('cleverbot-node');
const cleverbot = new Cleverbot;
cleverbot.configure({botapi: cleverbot_key});
const guildSettings = require('../lib/guilddb');
const botUsers = require('../lib/botUsers');

module.exports = function (message) {
    if (!message.content) return message.author.send('You need to enter the code!');
    if (message.channel.type === "dm" && !message.author.bot) {
        botUsers.findOne({
            userID: message.author.id,
            code: message.content
        }, (err, user) => {
            if (err) {
                console.error(err);
            }
            if (user) {
                if (!user.checked) {
                    if (message.content.toString() === user.code) {
                        console.log(user.guildId);
                        var role = client.guilds.get(user.guildId).roles.find(r => r.name === "notverified");
                        var member = client.guilds.get(user.guildId).members.find(m => m.id === user.userID);
                        user.checked = true;
                        message.reply('Your account has been verified!\nYou can now chat with your friends on the server.');
                        botUsers.findOneAndUpdate({userID: message.author.id}, user, (err) => {
                            if (err) throw err;
                            console.log('Saved user');
                        });
                        member.removeRole(role).then(() => console.log('removed role')).catch(e => console.log(e));

                    } else {
                        message.author.send('Invalid ID.');
                    }
                }
            } else if (!user) {
                if (message.author.bot) return;
                message.author.send('Wrong code entered!');
            }
        });
    }
};