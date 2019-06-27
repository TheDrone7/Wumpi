const mongoose = require("mongoose");

const backupSchema = mongoose.Schema({
    key: String,
    id: String,
    authorId: String,
    guild: {
        name: String,
        region: String,
        filter: Number,
        icon: String,
        afkChannel: {
            name: String,
            timeout: Number,
        },
        roles: Object,
    },
    channels: Object
});

module.exports = mongoose.model("Backup", backupSchema);