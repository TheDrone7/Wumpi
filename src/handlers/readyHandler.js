const {default_prefix} = require('../config.json');
const client = require('../wumpi.js');
const guildSettings = require('../lib/guilddb');
const PollSchema = require('../lib/polldb.js');
const ms = require('ms');

client.on('ready', async () => {
    await client.guilds.keyArray().forEach(id => {
        let name;
        client.guilds.forEach(g => {
            if (id === g.id) {
                name = g.name;
            }
        });

        guildSettings.findOne({
            id: id
        }, (err, guild) => {
            if (err) console.error(err);
            if (!guild) {
                const newGuildSettings = new guildSettings({
                    id: id,
                    name: name,
                    variables: {
                        prefix: default_prefix,
                        timezone: 'UTC-5',
                        supportRoleID: String,
                        ticketGreetingMessage: '\n' +
                            'The support team will respond to your ticket soon! \n\n' +
                            'Make sure to write all of your questions and concerns here, so we can be as quick as possible!',
                        ticketMaxTicketCount: 3,
                        filtered_words: []
                    },
                    values: {
                        isAutoSlowdownEnabled: true,
                        isAutoModEnabled: true,
                        isAntiBotEnabled: true,
                        isBackUpEnabled: true,
                        isActionLogEnabled: true,
                        isMusicEnabled: false,
                        isInviteTrackerEnabled: true,
                        isSupportTicketsEnabled: true
                    },
                    channels: {
                        maintenanceCategoryID: null,
                        ticketCategoryID: null,
                        ticketLogChannelID: null,
                        welcomeChannelID: null,
                        imageOnlyChannelIDs: [],
                        botOnlyChannelIDs: [],
                        userOnlyChannelIDs: []
                    }
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
  
    FetchPolls();
    EndPolls();
    ChangeColor();
});

const EndPolls = () => {
    setInterval(() => {
        PollSchema.find({}, (err, results) => {
            if(err) return console.error(err);
            if(results.length <= 0)
                return;

            var CurrentDate = new Date();
            results.forEach(result => {
                result.polls.forEach(async (poll, index) => {
                    var args = poll.date.split('/');
                    var hours = parseInt(args[0]), day = parseInt(args[1]), month = parseInt(args[2]);
                    if(month === CurrentDate.getMonth() + 1) {
                        if(day <= CurrentDate.getDate()) {
                            if(hours <= CurrentDate.getHours()) {
                                var channel = client.guilds.get(result.guildId).channels.get(poll.channelid);
                                if(channel) {
                                    var embed = await channel.fetchMessage(poll.pollid);
                                    if(embed) {
                                        if(embed.embeds.length > 0) {
                                            channel.send(`Poll with the title of '${embed.embeds[0].title}' ended`);
                                            result.polls.splice(index, 1);
                                            PollSchema.findOneAndUpdate({ guildId: result.guildId }, result, (err, updated) => {
                                                if(err) return console.error(err);
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    }
                })
            })
        })
    }, ms('1h'));
}

const FetchPolls = () => {
    PollSchema.find({}, (err, results) => {
        if(err) return console.error(err);
        if(results.length <= 0) 
            return;
        
        results.forEach(result => {
            result.polls.forEach(poll => {
                var channel = client.guilds.get(result.guildId).channels.get(poll.channelid);
                if(channel) {
                    channel.fetchMessages({ limit: 15 })
                    .then(() => console.log(`Fetched 25 messages in ${channel.name}`))
                    .catch(console.error());
                    channel.fetchMessage(poll.pollid).then(msg => {
                      msg.reactions.forEach(reaction => reaction.fetchUsers(100, { after: 100, before: 100 }).then(() => console.log("fetched reactions")).catch(console.error()))
                    })
                }
            })
        })
    })
}

const Colors25 = ["0x641E16", "0x512E5F", "0x154360"],
Colors50 = ["0x641E16", "0x512E5F", "0x154360", "0x0E6251", "0x7D6608"],
Colors100 = ["0x641E16", "0x512E5F", "0x154360", "0x0E6251", "0x7D6608", "0x784212", "0x7B7D7D", "0x1B2631", "0xF4D03F", "0xCD6155", "0xD5DBDB"];

var current25 = 0,
current50 = 0,
current100 = 0;

const ChangeColor = () => {
    setInterval(() => {
        current25 = GetColor25();
        current50 = GetColor50();
        current100 = GetColor100();
        client.guilds.forEach(async guild => {
            var level25 = await guild.roles.find(role => role.name === "level 25");
            if(level25) {
                level25.edit({
                    color: Colors25[current25]
                })
                .catch(console.error());
            }
            var level50 = await guild.roles.find(role => role.name === "level 50");
            if(level50) {
                level50.edit({
                    color: Colors50[current50]
                })
                .catch(console.error());
            }
            var level100 = await guild.roles.find(role => role.name === "level 100");
            if(level100) {
                level100.edit({
                    color: Colors100[current100]
                })
                .catch(console.error());
            }   
        })
    }, ms("10s"));
}

const GetColor25 = () => {
    const index = Math.floor(Math.random() * Colors25.length);
    if(index === current25)
        GetColor25();
    else
        return index;
}

const GetColor50 = () => {
    const index = Math.floor(Math.random() * Colors50.length);
    if(index === current50)
        GetColor50();
    else
        return index;
}

const GetColor100 = () => {
    const index = Math.floor(Math.random() * Colors100.length);
    if(index === current100)
        GetColor100();
    else
        return index;
}