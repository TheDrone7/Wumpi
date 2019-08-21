const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  userId: String,
  name: String,
  warns: Array,
  rank: {
    level: Number,
    xp: Number
  }
});

module.exports = mongoose.model("users", Schema);