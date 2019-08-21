const guildSettings = require('../../lib/guilddb');

module.exports = {
    name: 'setticketlog',
    description: 'Change the servers set ticket log.',
    guildOnly: true,
    permissionsRequired: ['ADMINISTRATOR'],
    cooldown: 30,
    args: true,
    aliases: ['ticketlog', 'ticket-log', 'set ticketlog', 'set ticket log'],
    usage: '[command name] "Category ID"',
    async execute(client, message, args) {
        const currentGuildID = message.guild.id;
        const newChannel = args[0];
        guildSettings.findOne({
            id: currentGuildID
        }, (err, g) => {
            if (err) return console.log(err);
            
            var newLog = message.guild.channels.find(c => c.name.toLowerCase() === newChannel.toLowerCase());
            if(!newLog) newLog =  message.guild.channels.find(c => c.id === newChannel);
          
            if(!newLog) return message.channel.send('Wasnt able to find that channel!');
          
            if(newLog.id === g.channels.ticketLogChannelID) return message.channel.send('This channel already is a ticket log channel!');
            
            var OldLog = message.guild.channels.find(c => c.id === g.channels.ticketLogChannelID);
          
            g.channels.ticketLogChannelID = newLog.id;
            guildSettings.findOneAndUpdate({id: currentGuildID}, g, (err) => {
              if(err) throw err;
            });
          
            if(!OldLog) {
              message.channel.send('I have set the ticket log to `' + newLog.name + '`');
            } else {
              message.channel.send('I have set the ticket log from `' + OldLog.name + '` to `' + newLog.name + '`');
            }
        });
    }
};