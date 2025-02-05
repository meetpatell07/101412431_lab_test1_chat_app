const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chat")


app.use(express.json());
app.use(cors());

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Routes
app.use('/api/v1', authRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/room', require('./routes/room'));

// Socket.io Logic
// require('./socket/socket')(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
