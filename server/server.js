const dotenv = require('dotenv');
const connectDB = require('./config/db');
const app = require('./app');

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    // Connect to MongoDB (will gracefully handle connection failure)
    await connectDB();

    // Start Express server
    const server = app.listen(PORT, () => {
      console.log(`[SERVER] Terra Kitchen API running on port ${PORT}`);
      console.log(`[SERVER] Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`[SERVER] Frontend: http://localhost:${PORT}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('[SERVER] SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('[SERVER] HTTP server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('[SERVER] SIGINT signal received: closing HTTP server');
      server.close(() => {
        console.log('[SERVER] HTTP server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('[SERVER] Failed to start:', error.message);
    // Don't exit - let app run in demo mode
  }
};

startServer();
