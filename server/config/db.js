const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Skip DB connection if no MongoDB URI is provided
    if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('your_mongodb_uri')) {
      console.log('[DB] MongoDB URI not configured. Running in demo mode.');
      return null;
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`[DB] Connected to MongoDB: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('[DB] Connection error:', error.message);
    console.log('[DB] Running in demo mode without database.');
    // Don't exit - allow app to run in demo mode
    return null;
  }
};

module.exports = connectDB;
