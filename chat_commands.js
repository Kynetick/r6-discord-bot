// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');
const { prefix, token } = require('./config.json');
const music = require('@koenie06/discord.js-music');
const fs = require('fs');
const ytdl = require("ytdl-core");

module.exports.chat_func = async function execute(message) {

    if(message.content.startsWith(prefix + 'julien')) {
            return message.channel.send("On sait t'es beau");
    }

    if(message.content.startsWith(prefix + 'track.soko')) {
        return message.channel.send("https://r6.tracker.network/profile/id/23c15616-0e67-4af6-8ba0-15cdbd879788");
    }

    if(message.content.startsWith(prefix + 'track.nasko')) {
        return message.channel.send("https://r6.tracker.network/profile/id/66c68143-554f-42cb-b051-986a927ada2a");
    }

    if(message.content.startsWith(prefix + 'track.atl4s')) {
        return message.channel.send("https://r6.tracker.network/profile/id/e3b61a18-9e70-46be-bba4-c59f0d09d92c");
    }

    if(message.content.startsWith(prefix + 'track.zito')) {
        return message.channel.send("https://r6.tracker.network/profile/id/0b1a36de-508f-4def-96e8-2e5f37b25784");
    }

    if(message.content.startsWith(prefix + 'track.kynetick')) {
        return message.channel.send("https://r6.tracker.network/profile/id/f721c1c6-a6fa-443d-8618-7d7c8f1968e8");
    }

    const troll = ['terroriste', 'terroristes', 'terro', 'Ben Laden', 'Aymar']
    for(let i = 0; i < troll.length; i++) { //read the array
        if (message.content.includes(troll[i])) {
            return message.channel.send("Alahouaquebarre");
        }
    }
}