const express = require('express'),
    router = express.Router();

const User = require('../schema/Schema').User;

router.post('/stream_key', (req, res) => {
    const stream_key = req.body.stream_key;
    console.log(`stream-key query: ${stream_key} ${req.body}`);
    User.findOne({ stream_key: stream_key }, (err, user) => {
        if (!err && user) {
            res.sendStatus(200);
        } else {
            console.error(`ERROR [userdb]: ${err.message}`);
            res.sendStatus(404);
        }
    });
});

module.exports = router;