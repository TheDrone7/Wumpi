const mongoose = require('mongoose');

const guildOverwrites = new mongoose.Schema({
    id: String,
    channels: {
        overwrites: Array
    }
});
module.exports = mongoose.model('guildOverwrites', guildOverwrites);