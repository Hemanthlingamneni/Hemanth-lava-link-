const { Shoukaku } = require('shoukaku');
const LavalinkServers = require('../../lavalink-server.json');
const Options = require('../../shoukaku-options.js');
const { LavasfyClient } = require('lavasfy');

class ShoukakuHandler extends Shoukaku {
    constructor(client) {
        super(client, LavalinkServers, Options);

        this.on('ready',
            (name, resumed) =>
                client.logger.log(`Lavalink Node: ${name} is now connected`, `This connection is ${resumed ? 'resumed' : 'a new connection'}`)
        );
        this.on('error',
            (name, error) =>
                client.logger.error(error)
        );
        this.on('close',
            (name, code, reason) =>
                client.logger.log(`Lavalink Node: ${name} closed with code ${code}`, reason || 'No reason')
        );
        this.on('disconnected',
            (name, reason) =>
                client.logger.log(`Lavalink Node: ${name} disconnected`, reason || 'No reason')
        );
        this.spotify = process.env.ENABLE_SPOTIFY === 'true'
            ? new LavasfyClient({
                clientID: process.env.SPOTIFY_ID,
                clientSecret: process.env.SPOTIFY_SECRET,
                playlistLoadLimit: process.env.SPOTIFY_PLAYLIST_PAGE_LIMIT,
                audioOnlyResults: true,
                useSpotifyMetadata: true 
            }, [...[...this.client.shoukaku.getNode()]])
            : null;

    }
}

module.exports = ShoukakuHandler;
