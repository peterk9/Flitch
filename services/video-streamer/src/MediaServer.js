const NodeMediaServer = require('node-media-server'),
    axios = require('axios'),
    config = require('./config/default');

const MediaServer = new NodeMediaServer(config.rtmp_server);

MediaServer.on('prePublish', async (id, StreamPath, args) => {
    let stream_key = getStreamKeyFromStreamPath(StreamPath);
    console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    try {
        let response = await axios.post(config.user_service.url, { stream_key: stream_key });
        if (response.status === 200) console.log(`publishing stream ${id}`);
    } catch (error) {
        console.log('[NodeEvent on prePublish]', `rejecting stream with id=${id} `);
        console.error(error.message);
        let session = MediaServer.getSession(id);
        session.reject();
    }

});

const getStreamKeyFromStreamPath = (path) => {
    let parts = path.split('/');
    return parts[parts.length - 1];
};

module.exports = MediaServer;