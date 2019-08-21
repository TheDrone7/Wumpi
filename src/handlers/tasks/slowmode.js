const ms = require('ms');

module.exports = {
    name: 'slowmode',
    description: 'Turns on slowmode.',
    guildOnly: true,
    cooldown: 5,
    permissionsRequired: ['ADMINISTRATOR'],
    aliases: ['channel slowmode', 'set channel slowmode'],
    args: false,
    usage: '[command name] "Time',
    /**
     * @param message
     * @param args
     */
    execute(client, message, args) {

        var rate = args[0];
        if(!rate) return message.channel.send('Enter a valid time!');
        if(isNaN(ms(rate))) return message.channel.send('You need to specify what rate limit this channel should have!');
        if((ms(rate)) > 21600) return message.channel.send('Your time in milliseconds must be less than 21600ms');

        message.channel.setRateLimitPerUser(ms(rate), 'Automatic').catch(e => console.log(e));
        message.channel.send('Set rate limit for channel to ' + rate);
    }
};