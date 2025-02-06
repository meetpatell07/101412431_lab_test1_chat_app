const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server);
const path = require("path")

const GroupMessage = require('./models/GroupMessage');

const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chat")

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(cors());

const predefinedRooms = ['devops', 'cloud computing', 'covid19', 'sports', 'nodeJS'];


// Database Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Routes
app.use('/api/v1', authRoutes);
app.use('/api/v1/chat', chatRoutes);
// app.use('/room', require('./routes/room'));

// Socket.io events
// let currentRoom = null;

// Socket.io events
io.on('connection', socket => {
    console.log('New client connected');
  
    socket.on('joinRoom', (room, username) => {
      socket.join(room);
      GroupMessage.find({ room }).then(messages => {
        messages.forEach(msg => {
          socket.emit('receiveMessage', msg.message, msg.from_user);
        });
      });
    });
  
    socket.on('sendMessage', async (message, room, username) => {
        if (!username || !room) return;
      
        const newMessage = new GroupMessage({ 
          from_user: username, 
          message: message, 
          room: room 
        });
      
        await newMessage.save(); // Save message to MongoDB
        io.to(room).emit('receiveMessage', message, username);
      });
      
    socket.on('typing', (room, username) => {
      io.to(room).emit('typing', username);
    });
  
    socket.on('leaveRoom', room => {
      socket.leave(room);
    });
  
    socket.on('privateMessage', ({ sender, recipient, message }) => {
        io.to(recipient).emit('receivePrivateMessage', { sender, message });
    });
      
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

// // Initialize Socket.io
// setupSocket(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
