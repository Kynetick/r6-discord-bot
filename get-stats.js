const {prefix} = require("./config.json");
require('dotenv').config();
const R6API = require('r6api.js').default;
const { MessageEmbed } = require('discord.js');
const currentSeason = "26";

const { UBI_EMAIL: email = '', UBI_PASSWORD: password = '' } = process.env;
const r6api = new R6API({ email, password });

// export default async () => { // ES6
module.exports.stats = async (message) => {

    if(message.content.startsWith(prefix + 'stats') && (!message.author.bot)) {
        const search_stats = message.content;
        const search_stats_items = search_stats.split(" "); //splits message content and fetch it into an array

        if (search_stats_items.length < 2) {
            message.channel.send("You need to enter a valid command. \n Try \`!stats <nickname>\` instead");
        } else {
            const username = search_stats_items[1]; // [0] is command, [1] is username
            const platform = 'uplay'; //if you want another value, check the doc : https://github.com/danielwerg/r6api.js#definitions

            const { 0: player } = await r6api.findByUsername(platform, username);
                if (!player) return message.channel.send('Player not found. Maybe you typed it wrong, check out the spelling');

            const { 0: stats } = await r6api.getStats(platform, player.id);
                if (!stats) return message.channel.send('Stats not found');
            const { pvp: { general } } = stats;

            const { 0: rank } = await r6api.getRanks(platform, player.id, { regionIds: 'emea', boardIds: 'pvp_ranked' });
                if (!rank) return;
            const { seasons: { 26: { regions: { emea: { boards: { pvp_ranked } } } } } } = rank;

            const { 0: level } = await r6api.getProgression(platform, player.id);

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
                .setFooter({ text: '\u00a9 Kynetick, 2022' });

            return message.channel.send({ embeds: [statsEmbed] });
        }
    }
};