const guildSettings = require('../../lib/guilddb');

module.exports = {
    name: 'setcategory',
    description: 'Change the servers set ticket category.',
    guildOnly: true,
    permissionsRequired: ['ADMINISTRATOR'],
    cooldown: 30,
    args: true,
    aliases: ['category', 'ticketcategory', 'set category', 'set ticketcategory'],
    usage: '[command name] "Category ID"',
    async execute(client, message, args) {
        const currentGuildID = message.guild.id;
        const CategoryName = args.join(' ');
        guildSettings.findOne({
            id: currentGuildID
        }, (err, g) => {
            if (err) return console.log(err);
          
            var newCategory = message.guild.channels.find(cat => cat.name.toLowerCase() === CategoryName.toLowerCase() && cat.type === "category");
            if(!newCategory) {
              newCategory = message.guild.channels.find(cat => cat.id === CategoryName && cat.type === "category")
            }
          
            if(newCategory.id === g.channels.ticketCategoryID) return message.channel.send('This category is already set as a ticket category!');
          
            if(!newCategory) return message.channel.send('Wasnt able to find a category with that name/id');
          
            var oldCategory = g.channels.ticketCategoryID ? message.guild.channels.get(g.channels.ticketCategoryID) : null;
            g.channels.ticketCategoryID = newCategory.id;
          
            guildSettings.findOneAndUpdate({id: currentGuildID}, g, (err, data) => {
              if(err) throw err;
              console.log(`New ticket category ID = ${data.channels.ticketCategoryID}`);
            });
          
            if(!oldCategory) {
              message.channel.send('I have set the ticket category to `' + newCategory.name + '`');
            } else {
              message.channel.send('I have set the ticket category from `' + oldCategory.name + '` to `' + newCategory.name + '`');
            }
        });
    }
};