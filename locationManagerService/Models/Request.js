const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pickupLocation: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true },
    },
    dropoffLocation: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true },
    },
    status: { type: String, enum: ['pending', 'accepted', 'completed'], default: 'pending' },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
    completed: { type: Boolean, default: false },
});

module.exports = mongoose.model('Request', RequestSchema);
