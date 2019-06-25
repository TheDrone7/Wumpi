const fs = require('fs');

module.exports = {
    name: 'imageonly',
    description: 'Sets the channel to image only.',
    aliases: ['set channel imageonly', 'set channel image-only', 'image-only'],
    permissionsRequired: ['MANAGE_CHANNELS'],
    usage: '[command name]',
    cooldown: 45,
    execute(message, args) {
        /** */
        let file = 'channelData.json';
        let obj = [];
        fs.readFile(file, function read(err, data) {
            if (err) {
                throw err;
            }
            let map = objToMap(data);
            if (data.exists) {
                let mapValues = map.values();
                let mapKeys = map.keys();
                if (mapValues[Symbol.iterator] === (message.channel.id) && mapKeys[Symbol.iterator] === ('image-only')) {
                    map.set(message.channel.id, 'text-channel');
                    obj = mapToObj(map);
                    message.reply('Disabling `image-only` mode for channel ' + message.channel.name + '.');
                    fs.writeFile(file, JSON.stringify(obj, null, 2), function (err) {
                        if (err) {
                            throw err;
                        } else {
                            console.log('Success! Logged ' + obj + ' to ' + file)
                        }
                    });
                }
            } else {
                map.set(message.channel.id, 'image-only');
                obj = mapToObj(map);
                message.reply('Channel is now `image-only`, now you can prune away these messages!');
                fs.writeFile(file, JSON.stringify(obj, null, 2), function (err) {
                    if (err) {
                        throw err;
                    } else {
                        console.log('Success! Logged ' + obj + ' to ' + file)
                    }
                });
            }
        });

        function mapToObj(inputMap) {
            let objTemp = {};

            inputMap.forEach(function (value, key) {
                objTemp[key] = value;
            });
            return objTemp;
        }

        function objToMap(obj) {
            let map = new Map();

            obj.forEach(function (value, key) {
                map.set(value, key);
            });
            return map;
        }
    },
};