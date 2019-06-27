const fs = require("fs");
const mongoose = require("mongoose");

module.exports = {
    name: 'imageOnly',
    description: 'Set your channel to only image mode',
    guildOnly: true,
    cooldown: 10,
    aliases: ['img'],
    args: false,
    usage: '',
    /**
     * @param client
     * @param message
     * @param args
     */
    execute(client, message, args) {
        let data = JSON.parse(fs.readFileSync("/app/channeling.json"));
        console.log(message.guild.id);
        if (data[message.guild.id]) {
            let skipped = 0;

            let imageOnly = data[message.guild.id].imageOnly;

            for (var i = 0; i < imageOnly.length; i++) {
                if (imageOnly[i] === message.channel.id) {
                    imageOnly.splice(i, 1);

                    message.channel.send(`Removed ${message.channel.toString()} from Image Only`);

                    //flat file => db
                    fs.writeFile("/app/channeling.json", JSON.stringify(data), (err) => {
                        if (err) console.log(err)
                    });

                    return;
                } else {
                    skipped++
                }
            }

            console.log(imageOnly.length);
            console.log(skipped);
            if (imageOnly.length <= skipped) {
                data[message.guild.id].imageOnly.push(message.channel.id);
                message.channel.send(`Added ${message.channel.toString()} to Image Only`);

                fs.writeFile("/app/channeling.json", JSON.stringify(data), (err) => {
                    if (err) console.log(err)
                });

            }
        } else {
            data[message.guild.id] = {
                imageOnly: [
                    `${message.channel.id}`
                ]
            };

            message.channel.send(`Added ${message.channel.toString()} to Image Only`);

            //flat file => db
            fs.writeFile("/app/channeling.json", JSON.stringify(data), (err) => {
                if (err) console.log(err)
            })
        }
    }
};