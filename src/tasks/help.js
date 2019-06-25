const {prefix} = require('../config.json');

module.exports = {
    name: 'help',
    description: 'List all of my commands or info about a specific command.',
    aliases: ['commands', 'cmds'],
    usage: '[command name]',
    cooldown: 10,
    execute(message, args) {
        const data = [];
        const {commands} = message.client;

        if (!args.length) {
            data.push('Here\'s a list of all my commands:');
            data.push(commands.map(command => command.name).join('\n'));
            data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);

            return message.author.send(data, {split: true})
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply('I sent you a dm!');
                    message.delete(2000);
                })
                .catch(error => {
                    console.error(`Failed to send help DM to ${message.author.tag}.\n`, error);
                    message.reply('I\'m unable to dm you ;(');
                });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply('that\'s not a valid command!');
        }

        data.push(`**Name:** ${command.name}`);

        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

        data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

        message.channel.send(data, {split: true});
    },
};