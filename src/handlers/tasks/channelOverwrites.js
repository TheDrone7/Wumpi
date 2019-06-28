const Discord = require("discord.js");
const prefix = require('../../config.json');
const maintenanceHandler = require('../maintenanceHandler.js');

module.exports = {
    name: 'save',
    description: 'Lock down the server for maintenance.',
    guildOnly: true,
    permissionsRequired: ['ADMINISTRATOR'],
    cooldown: 25,
    aliases: ['save'],
    usage: '[command name] "Reason"',
    execute(message, args) {
        maintenanceHandler.maintenanceSaveOverwrites(message);
    }
};