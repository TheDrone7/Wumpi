const guildSettings = require('../../lib/guilddb');

module.exports = {
    name: 'setsupportrole',
    description: 'Change the servers set ticket category.',
    guildOnly: true,
    permissionsRequired: ['ADMINISTRATOR'],
    cooldown: 30,
    args: true,
    aliases: ['setsupport', 'supportteam', 'set support role', 'supportrole'],
    usage: '[command name] "Category ID"',
    async execute(client, message, args) {
        const currentGuildID = message.guild.id;
        const newRole = args[0];
        guildSettings.findOne({
            id: currentGuildID
        }, (err, g) => {
            if (err) return console.log(err);
            var role = message.guild.roles.find(r => r.name.toLowerCase() === newRole.toLowerCase());
            if(!role) {
              role = message.guild.roles.find(r => r.id === newRole);
            }
          
            if(!role) return message.channel.send('Wasnt able to find that role!');
            
            if(role.id === g.variables.supportRoleID) return message.channel.send('That role is already set as support role!');
            
            var previousRole = message.guild.roles.find(r => r.id === g.variables.supportRoleID);
            g.variables.supportRoleID = role.id;
          
            guildSettings.findOneAndUpdate({id: currentGuildID}, g, (err) => {
              if(err) throw err;
              console.log('saved');
            });
            
            if(!previousRole) {
              message.channel.send('I have set the support role to `' + role.name + '`');
            } else {
              message.channel.send('I have set the support role from `' + previousRole.name + '` to `' + role.name + '`');
            }
        });
    }
}