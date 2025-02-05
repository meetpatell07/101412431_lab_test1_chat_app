const express = require('express');
const router = express.Router();

const rooms = ["devops", "cloud computing", "covid19", "sports", "nodeJS"];

// Get Available Rooms
router.get('/rooms', (req, res) => {
    res.json(rooms);
});

// Join Room
router.post('/join', (req, res) => {
    const { username, room } = req.body;

    if (!rooms.includes(room)) {
        return res.status(400).json({ msg: "Invalid room" });
    }

    res.json({ msg: `${username} joined ${room}` });
});

// Leave Room
router.post('/leave', (req, res) => {
    const { username, room } = req.body;

    res.json({ msg: `${username} left ${room}` });
});

module.exports = router;
