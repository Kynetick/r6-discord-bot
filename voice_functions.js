const {prefix} = require("./config.json");
const {joinVoiceChannel, getVoiceConnection} = require("@discordjs/voice");
const ytdl = require("ytdl-core");

module.exports.execute = async function execute(message, queue, serverQueue, client) {
    const args = message.content.split(" "); //defines a separator in order to get the url

    if(message.content.startsWith(prefix + 'play')) { //join voice channel
        if (!message.member.voice.channel) {
            return message.channel.send('You need to be in a voice channel to execute this command !');
        }
            /* else if (client.voice.connection === message.member.voice) { //checks if the bot is already in the channel
                return console.log("I'm already in the channel");

                } else {*/
                const channel = message.member.voice; //picking up voice channel id (where user is connected)
                const connection = joinVoiceChannel({
                    channelId: channel.channelId,
                    guildId: channel.guild.id,
                    adapterCreator: channel.guild.voiceAdapterCreator
                })
                console.log("Successfully connected to voice channel !");
            }

    const voiceChannel = message.member.voice.channel; //checks voice channel perms
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send("I need the permissions to join and speak in your voice channel!");
    }

    const songInfo = await ytdl.getInfo(args[1]); //
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
    };

    if (!serverQueue) {
        // Creating contract for our queue
        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true,
        };

        // Setting the queue using our contract
        queue.set(message.guild.id, queueConstruct);
        // Pushing the song to our songs array
        queueConstruct.songs.push(song);
        try {
            const channel = message.member.voice;
            queueConstruct.connection = getVoiceConnection(channel.guild.id);
            play(message.guild, queueConstruct.songs[0]);
        } catch (err) {
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
        }
    } else {
        serverQueue.songs.push(song);
        console.log(serverQueue.songs);
        return message.channel.send(song.title + 'has been added to the queue !');
    }

    function play(guild, song) { //play a song
        const serverQueue = queue.get(guild.id);
        if (!song) {
            serverQueue.voiceChannel.leave();
            queue.delete(guild.id);
        }
    }

    const dispatcher = serverQueue.connection
        .play(ytdl(song.url))
        .on("finish", () => {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}

module.exports.disconnect = async function disconnect(message) { //disconnection function
    if (message.content === prefix + 'leave') {
        const channel = message.member.voice;
        const connection = getVoiceConnection(channel.guild.id)

        if (!connection) return message.channel.send("I'm not in a voice channel !")

        connection.destroy()

        console.log('Disconnected from voice channel !');
    }
}