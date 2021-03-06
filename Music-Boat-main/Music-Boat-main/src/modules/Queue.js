const SenkuDispatcher = require('./SenkuDispatcher.js');

class Queue extends Map {
    constructor(client, iterable) {
        super(iterable);
        this.client = client;
    }

    async handle(node, track, msg) {
        const existing = this.get(msg.guild.id);
        if (!existing) {
            const player = await node.joinVoiceChannel({
                guildID: msg.guild.id,
                voiceChannelID: msg.member.voice.channelID,
                deaf: true
            });
            this.client.logger.debug(player.constructor.name, `New connection @ guild "${msg.guild.id}"`);
            const dispatcher = new SenkuDispatcher({
                client: this.client,
                guild: msg.guild,
                text: msg.channel,
                selfDeaf: true,
                player
            });
            dispatcher.queue.push(track);
            this.set(msg.guild.id, dispatcher);
            this.client.logger.debug(dispatcher.constructor.name, `New player dispatcher @ guild "${msg.guild.id}"`);
            return dispatcher;
        }
        existing.queue.push(track);
        return null;
    }
}
module.exports = Queue;
