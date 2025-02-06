const mongoose = require('mongoose');

const GroupMessageSchema = new mongoose.Schema({
    from_user: { type: String, required: true }, // Fix required field
    room: { type: String, required: true },
    message: { type: String, required: true },
    date_sent: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GroupMessage', GroupMessageSchema);
