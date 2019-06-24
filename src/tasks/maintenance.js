module.exports = {
    name: 'maintenance',
    description: 'Lock down the server for maintenance.',
    execute(message, args) {
        message.channel.send('Temporary test for making sure handler is all good.');
    },
};