const io = require('socket.io-client');
const socket = io('http://localhost:3000');

// Simulate driver ID and token
const isOnline=true;
const driverId =isOnline?1:'';
const jwtToken = 'your_jwt_token_here'; // Simulate a JWT token
if(driverId){
    // Join room for the driver
    socket.emit('join', driverId);
    // Listen for new requests
    socket.on('newRequest', (request) => {
    //console.log(('New request received:', request);
    // Simulate driver decision (accept or reject)
    setTimeout(() => {
        // Simulate rejection
        rejectRequest(request.requestId);
    }, 6000); // Simulate a 6-second delay before deciding
    });


    // Function to reject a request
    function rejectRequest(requestId) {
    fetch('http://localhost:3000/request/reject-request', {
        method: 'POST',
        body: JSON.stringify({ orderId:requestId, deliveryboyId:driverId })
    })
    .then(response => response.json())
    .then(data => {
        //console.log((data.message);
    })
    .catch(error => {
        console.error('Error:', error);
    });
    }

    // Listen for request acceptance
    socket.on('requestAccepted', (request) => {
    //console.log(('Request accepted:', request);
    });
}



// function haversineDistance(lat1, lon1, lat2, lon2) {
//   const R = 6371; // Radius of the Earth in kilometers
//   const dLat = (lat2 - lat1) * (Math.PI / 180);
//   const dLon = (lon2 - lon1) * (Math.PI / 180);
//   const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//             Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
//             Math.sin(dLon / 2) * Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c;
// }

// const pickupLocation = [12.9716, 77.5946];
// const driverLocation = [18.5206, 73.8570];

// const distance = haversineDistance(pickupLocation[1], pickupLocation[0], driverLocation[1], driverLocation[0]);

// //console.log((`Distance: ${distance} km`);
