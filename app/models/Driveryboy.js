const mongoose = require('mongoose');
const DriverBoySchema = new mongoose.Schema({
    drivery_boy_id: { type: [Number], required: true },
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true },
    },
    status: { type: String, enum: ['available', 'busy'], default: 'available' },
});
DriverBoySchema.index({ location: '2dsphere' });
module.exports = mongoose.model('DriverBoy', DriverBoySchema);