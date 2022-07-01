const {prefix} = require("./config.json");
require('dotenv').config();
const R6API = require('r6api.js').default;
const { MessageEmbed } = require('discord.js');
const currentSeason = "26";

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
        const { seasons: { 26: { regions: { emea: { boards: { pvp_ranked }} } } } } = rank;
        //console.log(pvp_ranked);

        const { 0: level } = await r6api.getProgression(platform, player.id);

        const embedAuthor = {
            name: `${player.username}`,
            iconURL: `${player.avatar["146"]}`,
            //url: 'https://discord.js.org',
        }

        const statsEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setAuthor({ name: `${player.username}`, iconURL: `${player.avatar["146"]}`})
            .setDescription(`${player.username}'s stats for current season`)
            .setThumbnail(`${rank.seasons[currentSeason].regions.emea.boards.pvp_ranked.current.icon}`)
            .addFields(
                { name: 'Level', value: `${level.level}`, inline: true },
                { name: 'K/D', value: `${rank.seasons[currentSeason].regions.emea.boards.pvp_ranked.kd}`, inline: true },
                { name: 'Matches', value: `${rank.seasons[currentSeason].regions.emea.boards.pvp_ranked.matches}`, inline: true },
                //{ name: '\u200B', value: '\u200B', inline: true },
                { name: 'Max', value: `${rank.seasons[currentSeason].regions.emea.boards.pvp_ranked.max.name}`, inline: true },
                { name: 'Rank', value: `${rank.seasons[currentSeason].regions.emea.boards.pvp_ranked.current.name}`, inline: true },
                { name: 'MMR', value: `${rank.seasons[currentSeason].regions.emea.boards.pvp_ranked.current.mmr}`, inline: true },
                { name: 'Winrate', value: `${rank.seasons[currentSeason].regions.emea.boards.pvp_ranked.winRate}`, inline: true },
                { name: 'Wins', value: `${rank.seasons[currentSeason].regions.emea.boards.pvp_ranked.wins}`, inline: true },
                { name: 'Losses', value: `${rank.seasons[currentSeason].regions.emea.boards.pvp_ranked.losses}`, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'Kynetick 2022', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

    console.log('Stats displayed');
    return message.channel.send({ embeds: [statsEmbed] });

    } else if (message.content.startsWith(prefix) && (!message.author.bot)) { //checks if the message starts with the prefix and was not sent by bot
        message.channel.send("You need to enter a valid command !");
    }
};