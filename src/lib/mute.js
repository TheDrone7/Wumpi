const mongoose = require("mongoose");

const muteSchema = mongoose.Schema({
    guildId: String,
    records: Array
});

module.exports = mongoose.model("mute", muteSchema);