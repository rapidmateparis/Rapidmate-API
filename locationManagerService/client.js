const io = require('socket.io-client');
const socket = io('http://localhost:3000');

// driver ID
const driverId = '66a108eaa92720be368eb5fe';

// Join room for the driver
socket.emit('join', driverId);

// Listen for new requests
socket.on('newRequest', (request) => {
    console.log('New request received:', request);
});

// Listen for request acceptance
socket.on('requestAccepted', (request) => {
    console.log('Request accepted:', request);
});

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});
