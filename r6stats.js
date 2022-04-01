const {prefix} = require("./config.json");
require('dotenv').config();
const R6API = require('r6api.js').default;
const { MessageEmbed } = require('discord.js');

const { UBI_EMAIL: email = '', UBI_PASSWORD: password = '' } = process.env;
const r6api = new R6API({ email, password });

// export default async () => { // ES6
module.exports.stats = async (message) => {

    if(message.content.startsWith(prefix + "stats")) {
        const research = message.content; //collects message content
        const research_items = research.split(" "); //splits message content and fetch it into an array

        // [0] is command, [1] is username
        const username = research_items[1]; //retrieving the 2nd item as username
        const platform = 'uplay'; //if you want another value, check the doc : https://github.com/danielwerg/r6api.js#definitions

        const { 0: player } = await r6api.findByUsername(platform, username);
        if (!player) return 'Player not found';

        const { 0: stats } = await r6api.getStats(platform, player.id);
        if (!stats) return 'Stats not found';
        const { pvp: { general } } = stats;

        const { 0: rank } = await r6api.getRanks(platform, player.id, { regionIds: 'emea', boardIds: 'pvp_ranked' });
        if (!rank) return;
        const { seasons: { 25: { regions: { emea: { boards: { pvp_ranked }} } } } } = rank;
        console.log(pvp_ranked);

        const { 0: level } = await r6api.getProgression(platform, player.id);

        const exampleEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`${player.username}`)
            .setURL('https://discord.js.org/')
            .setDescription('Some description here')
            .setThumbnail('https://i.imgur.com/AfFp7pu.png')
            .addFields(
                { name: 'h', value: 'h' },
                { name: '\u200B', value: '\u200B' },
                { name: 'Level', value: `${level.level}`, inline: true },
                { name: 'K/D', value: `${rank.seasons["25"].regions.emea.boards.pvp_ranked.kd}`, inline: true },
            )
            .setImage('https://i.imgur.com/AfFp7pu.png')
            .setTimestamp()

        console.log('Stats displayed');
        return message.channel.send({ embeds: [exampleEmbed] });

    } else if (message.content.startsWith(prefix) && (!message.author.bot)) { //checks if the message starts with the prefix and was not sent by bot
        message.channel.send("You need to enter a valid command !");
    }

};