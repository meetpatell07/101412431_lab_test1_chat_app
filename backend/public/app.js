// app.js
$(document).ready(function () {
    const socket = io('http://localhost:5000'); // Make sure to connect to the correct backend URL
  
    // Signup Form
    $('#signup-form').on('submit', function (e) {
      e.preventDefault();
  
      const username = $('#username').val();
      const firstname = $('#firstname').val();
      const lastname = $('#lastname').val();
      const password = $('#password').val();

      console.log('Signup Data:', { username, firstname, lastname, password });

  
      $.post('http://localhost:5000/api/v1/signup', { username, firstname, lastname, password }, function (response) {
        console.log('Signup response:', response);  // Log response from server

        alert('Signup successful!');
        window.location.href = 'chat.html';
      }).fail(function (error) {
        alert('Error signing up!');
      });
    });
  
    // Login Form
    $('#login-form').on('submit', function (e) {
      e.preventDefault();
  
      const username = $('#username').val();
      const password = $('#password').val();

  
      $.post('http://localhost:5000/api/v1/login', { username, password }, function (response) {
        localStorage.setItem('token', response.token);
        window.location.href = 'chat.html';

      }).fail(function (error) {
        alert('Error logging in!');
      });
    });
  
    // Join Room Button
    $('#join-room').on('click', function () {
      const room = $('#room-list').val(); // Selected room from the dropdown
      socket.emit('joinRoom', room);
    });
  
    // Send Message
    $('#send-message').on('click', function () {
      const message = $('#message-input').val();
      socket.emit('chatMessage', message);
      $('#message-input').val('');
    });
    
    // Logout Button
    $('#logout').on('click', function () {
      localStorage.removeItem('token');
      window.location.href = 'login.html';
    });
  });
  