const mongoose = require("mongoose");

const botUsers = mongoose.Schema({
    userID: String,
    guildId: String,
    username: String,
    code: String,
    checked: Boolean,
    isBot: Boolean,
    isSus: Boolean
});

module.exports = mongoose.model("botUsers", botUsers);