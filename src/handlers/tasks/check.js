const Discord = require("discord.js");
const {client} = require('../../wumpi.js');
module.exports = {
    name: 'check',
    description: 'Displays some about information.',
    cooldown: 30,
    aliases: ['captcha', 'antibot'],
    permissionsRequired: ['READ_MESSAGES'],
    usage: '[command name]',
    execute(message, args) {

    }
};