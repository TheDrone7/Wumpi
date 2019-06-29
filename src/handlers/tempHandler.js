const mongoose = require("mongoose");

const tempMute = require("../lib/backupdb");

exports.tempMute = function (guild, construct) {
    /*let construct = {
                      mutedId: toMute.user.id,
                      muted: toMute.user.username,
                      end: parseInt(Date.now() + ms(mutetime)),
                      active: true
                    }*/
    tempMute.findOne({
        guildId: guild
    }, async (err, guild) => {
        if (err) return new Error("Error found in tempMute");
        for (var i = 0; i < guild.records.length; i++) {
            if (guild.records[i].mutedId === construct.mutedId) {
                if (guild.records[i].end - Date.now() >= 0) {
                    guild.records[i].active = false;
                    return true
                }
            } else {
                return new Error("")
            }
        }
    })
};

exports.checkMute = function (guild, id) {
    tempMute.findOne({
        guildId: guild
    }, async (err, guild) => {
        if (err) return new Error("Error found in checkMute");
        for (var i = 0; i < guild.records.length; i++) {
            if (guild.records[i].mutedId === id) {
                if (guild.records[i].end - Date.now >= 0) {
                    return true;
                }
            } else {
                return false;
            }
        }
    })
};