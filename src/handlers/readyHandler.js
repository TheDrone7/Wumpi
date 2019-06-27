const {default_prefix, db_url} = require('../config.json');
const {client} = require('../wumpi.js');
const guildSettings = require('../lib/mongodb');
const mongoose = require("mongoose");
mongoose.connect(db_url, {useNewUrlParser: true}, (err) => {
    if (err) return console.error(err);
    console.log('Connected to MongoDB.');
}).catch();

client.on('ready', async () => {
    await client.guilds.keyArray().forEach(id => {
        guildSettings.findOne({
            guildID: id
        }, (err, guild) => {
            if (err) console.error(err);
            if (!guild) {
                const newGuildSettings = new guildSettings({
                    guildID: id,
                    prefix: default_prefix,
                    supportRoleID: null,
                    maintenanceCategoryID: null,
                    ticketCategoryID: null,
                    ticketGreetingMessage: '\n' +
                        'The support team will respond to your ticket soon! \n\n' +
                        'Make sure to write all of your questions and concerns here, so we can be as quick as possible!',
                    ticketMaxTicketCount: 3,
                    ticketLogChannelID: null,
                    imageOnlyChannelIDs: [],
                    botOnlyChannelIDs: [],
                    userOnlyChannelIDs: []
                });
                return newGuildSettings.save();
            }
        });
    });
    console.log('Bot is now receiving.');
    let count = 0;
    client.guilds.forEach(g => {
        count = count + g.memberCount;
    });
    client.user.setActivity(count + ' Users | ' + default_prefix + 'help', {type: 'LISTENING'}).catch();
});