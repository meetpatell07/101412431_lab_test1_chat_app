// socket/socket.js
const socketIo = require('socket.io');
const GroupMessage = require('../models/GroupMessage');
const PrivateMessage = require('../models/PrivateMessage');

let onlineUsers = []; // Array to keep track of online users (socket id and username)

const setupSocket = (server) => {
  const io = socketIo(server);

  io.on('connection', (socket) => {
    console.log('A user connected');

    // When a user joins a room
    socket.on('joinRoom', (room, username) => {
      socket.join(room);
      onlineUsers.push({ socketId: socket.id, username });
      console.log(`${username} joined room: ${room}`);

      // Notify users in the room
      io.to(room).emit('message', `${username} has joined the room`);

      // Emit a welcome message to the newly connected user
      socket.emit('message', `Welcome to ${room}, ${username}!`);

      // Load previous messages for the user from the database
      loadMessages(room, socket);
    });

    // When a user sends a group message
    socket.on('message', async (data) => {
      const { room, from_user, message } = data;

      // Save the group message to MongoDB
      const newMessage = new GroupMessage({ from_user, room, message });
      await newMessage.save();

      // Broadcast the message to users in the same room
      io.to(room).emit('message', { from_user, message, room });
    });

    // When a user sends a private message
    socket.on('privateMessage', async (data) => {
      const { from_user, to_user, message } = data;

      // Save the private message to MongoDB
      const newMessage = new PrivateMessage({ from_user, to_user, message });
      await newMessage.save();

      // Emit the private message to the recipient
      const recipientSocket = getSocketByUsername(to_user);
      if (recipientSocket) {
        io.to(recipientSocket.socketId).emit('privateMessage', { from_user, message });
      }
    });

    // Typing indicator
    socket.on('typing', (data) => {
      const { room, username } = data;
      socket.to(room).emit('typing', `${username} is typing...`);
    });

    // When a user leaves a room
    socket.on('leaveRoom', (room, username) => {
      socket.leave(room);
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
      console.log(`${username} left room: ${room}`);
      io.to(room).emit('message', `${username} has left the room`);
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log('A user disconnected');
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    });
  });
};

// Helper function to find a user's socket by username
const getSocketByUsername = (username) => {
  return onlineUsers.find((user) => user.username === username);
};

// Helper function to load previous messages from MongoDB for the room
const loadMessages = async (room, socket) => {
  const groupMessages = await GroupMessage.find({ room }).sort({ date_sent: -1 }).limit(10);
  groupMessages.forEach((message) => {
    socket.emit('message', { from_user: message.from_user, message: message.message, room });
  });
};

module.exports = setupSocket;
