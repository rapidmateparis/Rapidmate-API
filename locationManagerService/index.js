const express = require('express');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const http = require('http');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./Models/User');
const Driver = require('./Models/Driver');
const Request = require('./Models/Request');
const auth = require('./middleware/auth');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
const blacklist = new Set();

mongoose.connect('mongodb://localhost/pickup-dropoff', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// User registration
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = new User({ username, password });
        await user.save();
        res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).send(error);
    }
});

// User login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).send({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });
        res.send({ token });
    } catch (error) {
        res.status(400).send(error);
    }
});

// Driver registration
app.post('/driver/register', async (req, res) => {
    const { username, password, coordinates } = req.body;
    try {
        const driver = new Driver({
            username,
            password,
            location: {
                type: 'Point',
                coordinates
            }
        });
        await driver.save();
        res.status(201).send({ message: 'Driver registered successfully' });
    } catch (error) {
        res.status(400).send(error);
    }
});

// Driver login
app.post('/driver/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const driver = await Driver.findOne({ username });
        if (!driver) return res.status(400).send({ message: 'Driver not found' });

        const isMatch = await bcrypt.compare(password, driver.password);
        if (!isMatch) return res.status(400).send({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: driver._id }, 'secret', { expiresIn: '1h' });
        res.send({ token });
    } catch (error) {
        res.status(400).send(error);
    }
});

// Logout endpoint
app.post('/logout', auth, (req, res) => {
    const token = req.header('x-auth-token');
    if (token) {
        blacklist.add(token);
        res.send({ message: 'Logged out successfully' });
    } else {
        res.status(400).send({ message: 'No token provided' });
    }
});
// Create a pickup request
app.post('/request', async (req, res) => {
    const { userId, pickupLocation, dropoffLocation } = req.body;
    try {
        const request = new Request({
            user: userId,
            pickupLocation,
            dropoffLocation,
        });
        await request.save();

        // Find nearby available drivers
        const drivers = await Driver.find({
            location: {
                $near: {
                    $geometry: { type: 'Point', coordinates: pickupLocation.coordinates },
                    $maxDistance: 5000,
                },
            },
            status: 'available'
        });

        drivers.forEach(driver => {
            io.to(driver._id.toString()).emit('newRequest', request);
        });

        res.status(201).send(request);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Accept a request
app.post('/accept-request', async (req, res) => {
    const { requestId, driverId } = req.body;
    try {
        const request = await Request.findById(requestId);
        if (!request) return res.status(400).send({ message: 'Request not found' });

        request.status = 'accepted';
        request.driver = driverId;
        await request.save();

        const driver = await Driver.findById(driverId);
        driver.status = 'busy';
        await driver.save();

        io.emit('requestAccepted', request);
        res.send(request);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Complete a request
app.post('/complete-request', auth, async (req, res) => {
    const { requestId } = req.body;
    try {
        const request = await Request.findById(requestId);
        if (!request) return res.status(400).send({ message: 'Request not found' });

        request.status = 'completed';
        request.completed = true;
        await request.save();

        const driver = await Driver.findById(request.driver);
        driver.status = 'available';
        await driver.save();

        res.send({ message: 'Request completed successfully' });
    } catch (error) {
        res.status(400).send(error);
    }
});

// Update driver location
app.put('/driver/location', auth, async (req, res) => {
    const { coordinates } = req.body;
    try {
        const driver = await Driver.findById(req.user.id);
        driver.location.coordinates = coordinates;
        await driver.save();
        res.send({ message: 'Location updated successfully' });
    } catch (error) {
        res.status(400).send(error);
    }
});

io.on('connection', (socket) => {
    console.log('A user connected', socket.id);
    socket.on('join', (driverId) => {
        socket.join(driverId);
        console.log(`Driver ${driverId} joined room ${driverId}`);
    });
    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
