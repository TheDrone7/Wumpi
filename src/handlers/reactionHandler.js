const {client} = require('../wumpi.js');

/**
 * Called whenever a reaction is added to a message.
 * @param reaction
 * @param user
 */
client.on('messageReactionAdd', (reaction, user) => {
    // DO STUFF
});

client.on('messageReactionRemove', (reaction, user) => {
    // DO STUFF
});