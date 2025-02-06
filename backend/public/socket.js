// socket.js
const socket = io('http://localhost:5000'); // Adjust according to your backend URL

socket.on('availableRooms', function (rooms) {
  const roomList = $('#room-list');
  rooms.forEach(function (room) {
    roomList.append(`<option value="${room}">${room}</option>`);
  });
});

socket.on('message', function (msg) {
  $('#messages-list').append(`<li>${msg}</li>`);
});

socket.on('typing', function (message) {
  $('#typing-indicator').text(message);
});

$('#message-input').on('input', function () {
  socket.emit('typing', 'User is typing...');
});
