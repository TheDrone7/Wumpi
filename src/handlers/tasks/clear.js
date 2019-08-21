module.exports = {
    name: 'clear',
    description: 'Cleans some message',
    aliases: ['clean', 'prune'],
    permissionsRequired: ['MANAGE_MESSAGES'],
    usage: '[command name] [message count (<= 100)]',
    args: true,
    guildOnly: true,
   
    async execute(client, message, args) {
      
      var count = parseInt(args[0]);
      
      await message.delete().catch(console.error());
    
      if(count > 100) {
        message.channel.send('I can only bulk delete up to 100 messages!')
        .then(msg => msg.delete(5000))
        .catch(e => console.log(e));
        return;
      }
      
      message.channel.fetchMessages({ limit: count }).then(MessageMap => {
        message.channel.bulkDelete(MessageMap).then(() => {
          message.channel.send(`Deleted ${count} messages`)
          .then((msg) => msg.delete(5000))
          .catch(e => console.log(e));
        });
      });
    }
}