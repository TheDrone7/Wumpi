const mongoose = require('mongoose');

const guildSettings = new mongoose.Schema({
    id: String,
    name: String,
    variables: {
        prefix: String,
        timezone: String,
        supportRoleID: String,
        ticketGreetingMessage: String,
        ticketMaxTicketCount: Number,
        filtered_words: Array
    },
    values: {
        isAutoSlowdownEnabled: Boolean,
        isAutoModEnabled: Boolean,
        isAntiBotEnabled: Boolean,
        isBackUpEnabled: Boolean,
        isActionLogEnabled: Boolean,
        isMusicEnabled: Boolean,
        isInviteTrackerEnabled: Boolean,
        isSupportTicketsEnabled: Boolean
    },
    channels: {
        maintenanceCategoryID: String,
        ticketCategoryID: String,
        ticketLogChannelID: String,
        welcomeChannelID: String,
        imageOnlyChannelIDs: Array,
        botOnlyChannelIDs: Array,
        userOnlyChannelIDs: Array
    }
});

module.exports = mongoose.model('guildSettings', guildSettings);