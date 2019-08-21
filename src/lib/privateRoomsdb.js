const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  userId: String,
  name: String,
  rooms: Array
});

module.exports = mongoose.model("privaterooms", Schema)