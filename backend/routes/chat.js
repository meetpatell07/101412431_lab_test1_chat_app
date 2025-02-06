const express = require('express');
const { sendMessage, getMessages, joinRoom, leaveRoom } = require('../controllers/chatController');

const router = express.Router();

router.post('/send', sendMessage);
router.get('/get/:room', getMessages);
router.post('/join-room', joinRoom);
router.post('/leave-room', leaveRoom);

module.exports = router;
