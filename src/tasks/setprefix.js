const Discord = require("discord.js");
const prefix = require('../config.json');
const fs = require('fs');

module.exports = {
    name: 'setprefix',
    description: 'Change the servers set prefix.',
    guildOnly: true,
    permissionsRequired: ['ADMINISTRATOR'],
    cooldown: 60,
    aliases: ['prefix'],
    usage: '[command name] "Prefix"',
    execute(message, args) {

    }
};