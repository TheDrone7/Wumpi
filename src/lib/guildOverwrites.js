const mongoose = require('mongoose');

const guildOverwrites = new mongoose.Schema({
    guild_id: String,
    channels: {
        overwrites: Map
    }
});

module.exports = mongoose.model('guildOverwrites', guildOverwrites);