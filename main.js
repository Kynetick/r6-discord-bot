// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const { prefix, token } = require('./config.json');

//importing needed functions
const {chat_func} = require('./chat_commands.js');
const {stats} = require('./r6stats.js')

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Ready!');
});

client.on('messageCreate', async message => {
    await stats(message);
    //await chat_func(message);
})

// Login to Discord with your client's token
client.login(token);