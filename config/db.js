const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/rapidmatemdb',{
        connectTimeoutMS: 30000, // 30 seconds
        socketTimeoutMS: 30000,  // 30 seconds
      });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;