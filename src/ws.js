const Express = require('express');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const cookies = require('cookies');
const OAuth = require('disco-oauth');
const mongoose = require('mongoose');
const {RichEmbed} = require('discord.js');
const guildSchema = require('./lib/guilddb');
const fs = require('fs');
const {bot_oath, db_url, client_id} = require('./config.json');
const OAuth2 = new OAuth(client_id, bot_oath);
OAuth2.setScopes(["identify", "guilds"]);
OAuth2.setRedirect("https://wumpi-github.glitch.me/overview");
const BotInv = new OAuth(client_id, bot_oath);
BotInv.setScopes(["bot"]);
BotInv.setRedirect("https://wumpi-github.glitch.me/overview");

class WebSocket {
    constructor(client) {
        this.Client = client;
        mongoose.connect(db_url, {useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true }, (err) => {
            if (err) return console.error(err);
            console.log('Connected to MongoDB.');
        }).catch();
        this.app = Express();
        this.app.engine('hbs', hbs({
            extname: 'hbs',
            layoutsDir: path.join(__dirname, 'layouts'),
            defaultLayout: 'layout',
        }));
        this.app.set('views', path.join(__dirname, 'views'));
        this.app.set('view engine', 'hbs');
        this.app.use(Express.static(path.join(__dirname, 'public')));
        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(bodyParser.json());
        this.app.use(cookies.express(["some", "random", "keys"]));
        this.registerWebPages();
        this.Server = this.app.listen(3000);
        console.log(this.Server.address().port);
    }

    static HasPermissions(Guild) {
        let Perms = Guild.userPerms;
        let YourPerms = [];
        for (let i = 0; i < Perms.length; i++) {
            if (Perms[i] === 'ADMINISTRATOR' || Perms[i] === 'MANAGE_GUILD') {
                YourPerms.push(Perms[i]);
                if (YourPerms.length === 2) return true;
            } else if (i === Perms.length - 1) return false;
        }
    }

    registerWebPages() {
        this.app.get('/', (req, res) => {
            res.clearCookie('key');
            res.clearCookie('guildId');
            res.redirect('/welcome');
        });
        this.app.get('/welcome', async (req, res) => {
            res.render('welcome', {
                title: "Welcome",
                AuthLink: await OAuth2.getAuthCodeLink()
            });
        });
        this.app.get('/overview', async (req, res) => {
            let key = req.query.code;
            let userkey;
            if (key !== undefined) {
                if (!(req.cookies.get('key'))) {
                    // console.log('Got key!');
                    userkey = await OAuth2.getAccess(key);
                    res.cookie('key', userkey);
                }
            } else {
                userkey = req.cookies.get('key');
            }
            let guildId = req.cookies.get('guildId') ? req.cookies.get('guildId') : req.query.guild_id;
            if (req.query.guild_id) res.cookie('guildId', guildId);
            if (req.query.guild_id !== undefined) {
                guildSchema.findOne({id: req.query.guild_id}, async (err, result) => {
                    if (result === null) {
                        this.MyGuildSettings = await guildSchema.createCollection({
                            id: req.query.guild_id,
                            name: this.Client.guilds.get(req.query.guild_id).name,
                            variables: {
                                prefix: "-",
                                timezone: String,
                                supportRoleID: null,
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
                        }, (err) => {
                            if (err) throw err;
                            this.MyGuildSettings.save();
                            res.redirect('/overview');
                        });
                    } else {
                        res.redirect('/overview');
                    }
                });
            }
            if (userkey === undefined) return;
            let user = await OAuth2.getAuthorizedUser(userkey);
            let guilds = await OAuth2.getAuthorizedUserGuilds(userkey);
            let temp = this.GetOwnerGuilds(guilds);
            let myGuilds = temp.Arr;
            let guildOptions = temp.GuildOptions;
            let currentGuild = this.Client.guilds.get(guildId);
            res.render('dashboard', {
                title: "Dashboard",
                Username: user.username,
                Guild: myGuilds,
                BotInvite: await BotInv.getAuthCodeLink(),
                GuildOptions: encodeURI(JSON.stringify(guildOptions)),
                NoGuild: !!currentGuild,
                guildName: currentGuild ? currentGuild.name : "No guild specified",
                guildChannels: currentGuild ? "Channels: " + currentGuild.channels.array().length.toString() : "No guild specified",
                guildRoles: currentGuild ? "Roles: " + currentGuild.roles.array().length.toString() : "No guild specified",
                guildMembers: currentGuild ? "Members: " + currentGuild.memberCount.toString() : "No guild specified"
            });
        });
        this.app.post('/setGuild', (req, res) => {
            let guildId = req.body.selectedGuild;
            // console.log('set and redirect!');
            guildSchema.findOne({id: guildId}, (err, result) => {
                if (err) throw err;
                console.log(result);
                if (result) {
                    // console.log('Saved settings');
                    this.MyGuildSettings = result;
                    this.MyGuildSettings.save();
                }
                // console.log('Works');
                res.cookie('guildId', guildId);
                res.redirect(req.get('referer'));
            });
        });
        this.app.get('/channels', async (req, res) => {
            let key = req.cookies.get('key');
            let user = await OAuth2.getAuthorizedUser(key);
            let guildId = req.cookies.get('guildId');
            if(!guildId) return; 
            if (!guildId) res.redirect('/overview');
            let temp = this.Client.guilds.get(guildId).channels.array().filter(c => c.type === "text");
            let cat = this.Client.guilds.get(guildId).channels.array().filter(c => c.type === "category");
            let channel = [];
            for (let i = 0; i < temp.length; i++)
                channel.push({id: temp[i].id, name: temp[i].name});
            let categories = [];
            for (let j = 0; j < cat.length; j++)
                categories.push({id: cat[j].id, name: cat[j].name});
            res.render("channels", {
                title: "Channels",
                Username: user.username,
                chan: channel,
                BotInvite: await BotInv.getAuthCodeLink(),
                category: categories,
                ChannelSettings: this.GenerateChannelSettings(
                    this.Client.guilds.get(guildId).channels.filter(c => c.type === "text"),
                    "channel"
                ),
                CategorySettings: this.GenerateChannelSettings(
                    this.Client.guilds.get(guildId).channels.filter(c => c.type === "category"),
                    "category"
                )
            });
        });
        this.app.post('/updateChannels', (req, res) => {
            let channelId = req.body.channelid;
            let isWelcome = !!req.body.Wel;
            let topic = req.body.Topic;
            let isTicket = !!req.body.Tick;
            let chanName = req.body.channelName;
            this.UpdateDataBase_Channels(isTicket, isWelcome, channelId, topic);
            let chan = this.Client.guilds.get(req.cookies.get('guildId')).channels.get(channelId);
            this.CreateLog({
                title: "New channel options",
                description: "set new channels options through panel",
                fieldAction: "Channel options",
                Details: `Channel: ${chan.name}\nWelcome channel: ${isWelcome ? "true" : "false"}\nTopic: ${topic}\nTicket channel: ${isTicket ? "true" : "false"}`
            }, req.cookies.get('guildId'));
            if (chanName === chan.name) return;
            let beforeName = chan.name;
            chan.setName(chanName).then(() => {
                this.CreateLog({
                    title: "Renamed channel",
                    description: "Renamed channel from Panel",
                    fieldAction: "Renamed channel",
                    Details: `Channel before: ${beforeName}\nChannel now: ${chanName}`
                }, req.cookies.get('guildId'));
            });
        });
        this.app.post('/sendMessage', (req, res) => {
            let channelId = req.body.channelid;
            let message = req.body.msg;
            if (channelId === "None") return;
            this.Client.guilds.get(req.cookies.get('guildId')).channels.get(channelId).send(message);
            res.end();
        });
        this.app.post('/createChannel', async (req, res) => {
            let categoryId = req.body.catId;
            let channelName = req.body.channelName;
            let newChannel = await this.Client.guilds.get(req.cookies.get('guildId')).createChannel(channelName);
            if (categoryId !== "None") newChannel.setParent(categoryId);
            this.CreateLog({
                title: "Created channel",
                description: "Created a new channel from panel",
                fieldAction: "Channel created",
                Details: `Channel: ${channelName}\nCategory: ${categoryId !== "None" ? categoryId : "None"}`
            }, req.cookies.get('guildId'));
        });
        this.app.post('/updateCategories', (req, res) => {
            let categoryId = req.body.cats;
            let isMain = req.body.main ? true : false;
            let isTicket = req.body.ticket ? true : false;
            this.UpdateDataBase_Category(categoryId, isMain, isTicket);
            this.CreateLog({
                title: "Category setting",
                description: "Changed category settings from panel",
                fieldAction: "Category settings overwritten",
                Details: `${categoryId} is supposed to work for ${isMain ? "Maintenance" : isTicket ? "Tickets" : "nothing"} now`
            }, req.cookies.get('guildId'));
        });
        this.app.get('/custom', async (req, res) => {
            let user = await OAuth2.getAuthorizedUser(req.cookies.get('key'));
            let guildId = req.cookies.get('guildId');
            if (!guildId) res.redirect('/overview');
            res.render('custom', {
                title: "Custom",
                CustomOptions: this.GenerateChannelSettings(null, "custom"),
                Username: user.username,
                BotInvite: await BotInv.getAuthCodeLink()
            });
        });
        this.app.post('/setPrefix', (req, res) => {
            let prefix = req.body.prefix;
            let oldPrefix = this.MyGuildSettings.variables.prefix;
            if (prefix === "" || prefix === null || prefix === oldPrefix) return;
            this.UpdateDataBase_Custom(prefix, null, null);
            this.CreateLog({
                title: "Changed prefix",
                description: "Changed prefix from Panel",
                fieldAction: "Prefix change",
                Details: `Changed from ${oldPrefix} to ${prefix}`
            }, req.cookies.get('guildId'));
        });
        this.app.post('/setWords', (req, res) => {
            let words = req.body.filteredWords ? req.body.filteredWords.split(', ') : [];
            let oldWords = this.MyGuildSettings.variables.filtered_words;
            if (oldWords === words) return;
            this.UpdateDataBase_Custom(null, words, null);
            this.CreateLog({
                title: "Filtered words",
                description: "Changed filtered words from panel",
                fieldAction: "Changed words",
                Details: "Changed words from\n```" + (oldWords.length <= 0 ? "__None__" : oldWords.join(', ')) + "```\nto " + "```" + (words.length <= 0 ? "__None__" : words.join(', ')) + "```"
            }, req.cookies.get('guildId'));
        });
        this.app.post('/setTicketGreetingMessage', (req, res) => {
            let greetings = req.body.GreetingsText;
            let old = this.MyGuildSettings.variables.ticketGreetingMessage;
            if (greetings === old) return;
            this.UpdateDataBase_Custom(null, null, greetings);
            this.CreateLog({
                title: "Changed Greetings",
                description: "Changed greetings from panel",
                fieldAction: "Changed ticket greetings",
                Details: `From: ***${old}***\nTo: ***${greetings}***`
            }, req.cookies.get('guildId'));
        });
        this.app.get('/staff', async (req, res) => {
            let guildId = req.cookies.get('guildId');
            if (!guildId) res.redirect('/overview');
            let user = await OAuth2.getAuthorizedUser(req.cookies.get('key'));
            res.render('staff', {
                title: "Staff",
                StaffOptions: this.GenerateChannelSettings(null, "staff"),
                Username: user.username,
                BotInvite: await BotInv.getAuthCodeLink()
            });
        });
        this.app.post('/setStaffProperties', (req, res) => {
            let isAutoSlowdownEnabled = !!req.body.SlowDown;
            let isAutoModEnabled = !!req.body.AutoMode;
            let isAntiBotEnabled = !!req.body.Antibot;
            let isBackUpEnabled = !!req.body.Backup;
            let isActionLogEnabled = !!req.body.Logs;
            let isMusicEnabled = !!req.body.Music;
            let isInviteTrackerEnabled = !!req.body.ITracker;
            let isSupportTicketsEnabled = !!req.body.STickets;
            let before = this.MyGuildSettings.values;
            this.UpdateDataBase_Staff({
                isActionLogEnabled: isActionLogEnabled,
                isAutoModEnabled: isAutoModEnabled,
                isAutoSlowdownEnabled: isAutoSlowdownEnabled,
                isAntiBotEnabled: isAntiBotEnabled,
                isBackUpEnabled: isBackUpEnabled,
                isMusicEnabled: isMusicEnabled,
                isInviteTrackerEnabled: isInviteTrackerEnabled,
                isSupportTicketsEnabled: isSupportTicketsEnabled
            });
            this.CreateLog({
                title: "Updated server settings",
                description: "Main settings of the server overwritten from panel",
                fieldAction: "Server values",
                Details: "Before: ```" + before + "```\nNow: ```" + this.MyGuildSettings.values + "```"
            }, req.cookies.get('guildId'));
        });
    }

    CreateLog({title = "", color = "0xffa500", description = "", fieldAction = "", Details = ""}, guildId) {
        if (!this.MyGuildSettings.values.isActionLogEnabled) return;
        let embed = new RichEmbed()
            .setAuthor(this.Client.user.username, this.Client.user.avatarURL)
            .setColor(color)
            .setTitle(title)
            .setDescription(description)
            .addField(fieldAction, Details)
            .setFooter(new Date().toDateString());
        let channel = this.Client.guilds.get(guildId).channels.find(c => c.name.includes('actionlog') && c.type === "text");
        if (!channel) return;
        channel.send(embed);
    }

    UpdateDataBase_Channels(isTicket, isWelcome, ActionId, topic) {
        this.MyGuildSettings.channels.ticketLogChannelID = isTicket ? ActionId : null;
        this.MyGuildSettings.channels.welcomeChannelID = isWelcome ? ActionId : null;
        if (topic !== "None") {
            if (topic === "isImage") {
                if (CheckForId(ActionId, this.MyGuildSettings.channels.imageOnlyChannelIDs)) return;
                this.MyGuildSettings.channels.imageOnlyChannelIDs.push(ActionId);
            } else if (topic === "isUser") {
                if (CheckForId(ActionId, this.MyGuildSettings.channels.botOnlyChannelIDs)) return;
                if (CheckForId(ActionId, this.MyGuildSettings.channels.userOnlyChannelIDs)) return;
                this.MyGuildSettings.channels.userOnlyChannelIDs.push(ActionId);
            } else if (topic === "isBot") {
                if (CheckForId(ActionId, this.MyGuildSettings.channels.userOnlyChannelIDs)) return;
                if (CheckForId(ActionId, this.MyGuildSettings.channels.botOnlyChannelIDs)) return;
                this.MyGuildSettings.channels.botOnlyChannelIDs.push(ActionId);
            }
        } else if (topic === "None") {
            if (CheckForId(ActionId, this.MyGuildSettings.channels.imageOnlyChannelIDs)) {
                this.MyGuildSettings.channels.imageOnlyChannelIDs = SetToNone(ActionId, this.MyGuildSettings.channels.imageOnlyChannelIDs);
            }
            if (CheckForId(ActionId, this.MyGuildSettings.channels.userOnlyChannelIDs)) {
                this.MyGuildSettings.channels.userOnlyChannelIDs = SetToNone(ActionId, this.MyGuildSettings.channels.userOnlyChannelIDs)
            }
            if (CheckForId(ActionId, this.MyGuildSettings.channels.botOnlyChannelIDs)) {
                this.MyGuildSettings.channels.botOnlyChannelIDs = SetToNone(ActionId, this.MyGuildSettings.channels.botOnlyChannelIDs);
            }
        }
        // console.log(this.MyGuildSettings);
        this.MyGuildSettings.save();
    }

    UpdateDataBase_Custom(Prefix, FilteredWords, Greetings) {
        this.MyGuildSettings.variables.prefix = Prefix ? Prefix : this.MyGuildSettings.variables.prefix;
        this.MyGuildSettings.variables.ticketGreetingMessage = Greetings ? Greetings : this.MyGuildSettings.variables.ticketGreetingMessage;
        this.MyGuildSettings.variables.filtered_words = FilteredWords ? FilteredWords : this.MyGuildSettings.variables.filtered_words;
        // console.log(this.MyGuildSettings);
        this.MyGuildSettings.save();
    }

    UpdateDataBase_Category(ActionId, isMain, isTicket) {
        this.MyGuildSettings.channels.ticketCategoryID = isTicket && this.MyGuildSettings.channels.maintenanceCategoryID !== ActionId ? ActionId : null;
        this.MyGuildSettings.channels.maintenanceCategoryID = isMain ? ActionId && this.MyGuildSettings.channels.ticketCategoryID !== ActionId : null;
        // console.log(this.MyGuildSettings);
        this.MyGuildSettings.save();
    }

    UpdateDataBase_Staff({isAutoSlowdownEnabled = Boolean, isAutoModEnabled = Boolean, isAntiBotEnabled = Boolean, isBackUpEnabled = Boolean, isActionLogEnabled = Boolean, isMusicEnabled = Boolean, isInviteTrackerEnabled = Boolean, isSupportTicketsEnabled = Boolean}) {
        this.MyGuildSettings.values.isAutoSlowdownEnabled = isAutoSlowdownEnabled;
        this.MyGuildSettings.values.isAutoModEnabled = isAutoModEnabled;
        this.MyGuildSettings.values.isAntiBotEnabled = isAntiBotEnabled;
        this.MyGuildSettings.values.isBackUpEnabled = isBackUpEnabled;
        this.MyGuildSettings.values.isActionLogEnabled = isActionLogEnabled;
        this.MyGuildSettings.values.isMusicEnabled = isMusicEnabled;
        this.MyGuildSettings.values.isSupportTicketsEnabled = isSupportTicketsEnabled;
        this.MyGuildSettings.values.isInviteTrackerEnabled = isInviteTrackerEnabled;
        // console.log(this.MyGuildSettings);
        this.MyGuildSettings.save();
    }

    GetOwnerGuilds(Guilds) {
        let Arr = [];
        let GuildOptions = {};
        for (let i = 0; i < Guilds.length; i++) {
            let guild = this.Client.guilds.get(Guilds[i].id);
            if (WebSocket.HasPermissions(Guilds[i]) && guild) {
                Arr.push({
                    id: guild.id,
                    name: guild.name
                });
                GuildOptions[guild.id] = {
                    id: guild.id,
                    name: guild.name,
                    channels: guild.channels.array().length,
                    roles: guild.roles.array().length,
                    members: guild.memberCount
                }
            }
        }
        return {Arr, GuildOptions};
    }

    GenerateChannelSettings(AddOthers, type) {
        let guildObject = this.MyGuildSettings.toObject();
        // console.log(this.MyGuildSettings);
        if (type != null) {
            if (type === "channel") {
                let channels = AddOthers.array();
                let chanObject = {};
                for (let i = 0; i < channels.length; i++) {
                    chanObject[channels[i].id] = {
                        id: channels[i].id,
                        name: channels[i].name,
                        isTicketLog: channels[i].id === this.MyGuildSettings.channels.ticketLogChannelID,
                        isWelcome: channels[i].id === this.MyGuildSettings.channels.welcomeChannelID,
                        imageOnly: this.MyGuildSettings.channels.imageOnlyChannelIDs.includes(channels[i].id),
                        botOnly: this.MyGuildSettings.channels.botOnlyChannelIDs.includes(channels[i].id),
                        userOnly: this.MyGuildSettings.channels.userOnlyChannelIDs.includes(channels[i].id)
                    }
                }
                guildObject = chanObject;
            }
            else if (type === "custom") {
                guildObject = {
                    Prefix: this.MyGuildSettings.variables.prefix,
                    GreetingMessage: this.MyGuildSettings.variables.ticketGreetingMessage,
                    FilteredWords: this.MyGuildSettings.variables.filtered_words
                };
            }
            else if (type === "category") {
                let cats = AddOthers.array();
                let chanObject = {};
                for (let i = 0; i < cats.length; i++) {
                    chanObject[cats[i].id] = {
                        id: cats[i].id,
                        name: cats[i].name,
                        isMaintenance: cats[i].id === this.MyGuildSettings.channels.maintenanceCategoryID,
                        isTicket: cats[i].id === this.MyGuildSettings.channels.ticketCategoryID
                    }
                }
                guildObject = chanObject;
            }
            else if (type === "staff") {
                guildObject = this.MyGuildSettings.values;
            }
        }
        guildObject = encodeURI(JSON.stringify(guildObject));
        return guildObject;
    }
}

let tries = 10;
let AllInvites = [];
let Invites = [];

function CheckForId(id, idCollection) {
    return idCollection.includes(id);
}

function SetToNone(id, Arr) {
    Arr.forEach((chan, index, array) => {
        if (chan === id) Arr.splice(index, 1);
    });
    return Arr;
}

module.exports = WebSocket;