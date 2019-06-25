const Discord = require("discord.js");
const prefix = require('../config.json');

module.exports = {
    name: 'ticket',
    description: 'Displays some about information.',
    cooldown: 30,
    aliases: ['new', 'support'],
    usage: '[command name] "Reason"',
    execute(message, args, command) {
        let server = message.channel.guild;
        let ticketEmbed = new Discord.RichEmbed()
            .setTitle('Support Ticket')
            .setTimestamp()
            .setColor(0x02fc62)
            .setDescription('Hello ' + message.author.tag + ', \n \n' +
                'The support team will respond to your ticket soon! \n' +
                'Make sure to write all of your questions and concerns here, so we can be as quick as possible!' +
                '\n\n' +
                '**Topic**: ' + (message.content.replace(prefix, '').replace(command, ''))+
                '\n\n' +
                'You can close the ticket any time with -close');

        server.createChannel('Support - ' + message.author.username, 'text',[{
            id: message.author.id,
            allow: ['READ_MESSAGES', 'SEND_MESSAGES', 'VIEW_CHANNEL', 'ATTACH_FILES'],
        },{
            id: server.defaultRole.id,
            deny: ['READ_MESSAGES', 'SEND_MESSAGES', 'VIEW_CHANNEL', 'ATTACH_FILES'],
        }]).then(channel => {
            message.channel.send(`Support ticket created ${channel}`);
            /** Temporary category find, we'll switch to the dynamic category asap */
            let category = server.channels.find(c => c.name === "Support Tickets" && c.type === "category");
            if (!category) throw new Error("Category channel does not exist.");
            channel.setParent(category.id);
            channel.send(ticketEmbed);
            channel.lockPermissions();
        }).then(msg =>{
            msg.delete(2500);
            message.channel.overwritePermissions(server.defaultRole.id, { SEND_MESSAGES: false, READ_MESSAGES: false, VIEW_CHANNEL: false });
            message.channel.overwritePermissions(message.author.id, { VIEW_CHANNEL: true, READ_MESSAGES: true, SEND_MESSAGES: true, ATTACH_FILES: true});
        }).catch(console.error);
    },
};