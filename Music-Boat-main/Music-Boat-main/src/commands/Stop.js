const Command = require('../abstract/Command.js');

class Stop extends Command {
    get name() {
        return 'stop';
    }

    get usage() {
        return 'stop';
    }

    get description() {
        return 'Stops the playback';
    }

    async run(msg) {
        if (!msg.member.voice.channelID)
            return await msg.channel.send('Admiral, you are not in a voice channel to perform this');
        const dispatcher = this.client.queue.get(msg.guild.id);
        if (!dispatcher)
            return await msg.channel.send('Nothing is playing in this guild.');
        if (dispatcher.player.voiceConnection.voiceChannelID !== msg.member.voice.channelID)
            return await msg.channel.send('Teitoku, you are not in the same voice channel where I am.');

        try {
            dispatcher.queue.length = 0;
            await dispatcher.player.stopTrack();
            msg.react('⏹️').catch(e => e);
        } catch (e) {
            msg.channel.send(`An error occured: ${e.message}.`);
        }
    }
}
module.exports = Stop;
