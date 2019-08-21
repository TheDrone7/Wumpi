const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  guildId: String,
  polls: Array
});

module.exports = mongoose.model("polls", Schema);