const GroupMessage = require('../models/GroupMessage');
const socket = require('../socket/socket'); // Import socket.io functionality (if using it here)


exports.sendMessage = async (req, res) => {
    try {
        const { from_user, room, message } = req.body;
        const newMessage = new GroupMessage({ from_user, room, message });
        await newMessage.save();
        // Emit the message to all users in the room via socket.io
        // socket.io.to(room).emit('message', { from_user, message, room });

        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error sending message', error });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const { room } = req.params;
        const messages = await GroupMessage.find({ room });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving messages', error });
    }
};

exports.joinRoom = (req, res) => {
    socket.emit('joinRoom', room);
    res.status(200).json({ message: 'Room joined successfully' });
};

exports.leaveRoom = (req, res) => {
    socket.emit('leaveRoom', room);

    res.status(200).json({ message: 'Room left successfully' });
};
