const mongoose = require('mongoose');

const guildSettings = new mongoose.Schema({
    guildID: String,
    prefix: String,
    supportRoleID: String,
    maintenanceCategoryID: String,
    ticketCategoryID: String,
    ticketGreetingMessage: String,
    ticketMaxTicketCount: Number,
    ticketLogChannelID: String,
    imageOnlyChannelIDs: Array,
    botOnlyChannelIDs: Array,
    userOnlyChannelIDs: Array
});

module.exports = mongoose.model('guildSettings', guildSettings);