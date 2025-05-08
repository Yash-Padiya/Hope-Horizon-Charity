const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Connect to MongoDB with added timeout options
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,  // Timeout after 5 seconds
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
