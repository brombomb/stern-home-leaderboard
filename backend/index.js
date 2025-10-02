require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const apiRoutes = require('./routes');
const SternAuth = require('./auth');

const app = express();

// Middleware
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
}));
app.use(express.json());
app.use(session({
  secret: 'stern-leaderboard-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }, // Set to true if using HTTPS
}));

// Routes
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5100;
let server;

// Initialize authentication and start server
async function startServer() {
  try {
    // Try to initialize authentication on startup
    await SternAuth.initializeAuth();

    server = app.listen(PORT, () => {
      console.log(`Backend listening on port ${PORT}`);
      console.log('Server started successfully');
    });
  } catch (error) {
    console.error('Error during startup:', error);
    // Start server anyway - authentication will be retried on API calls
    server = app.listen(PORT, () => {
      console.log(`Backend listening on port ${PORT}`);
      console.log('Server started with authentication issues - will retry on API calls');
    });
  }
}

// Graceful shutdown handling
function gracefulShutdown(signal) {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);

  if (server) {
    server.close(() => {
      console.log('Server closed');
      // eslint-disable-next-line no-process-exit
      process.exit(0);
    });

    // Force close after 10 seconds
    setTimeout(() => {
      console.log('Force closing server');
      // eslint-disable-next-line no-process-exit
      process.exit(1);
    }, 10000);
  } else {
    // eslint-disable-next-line no-process-exit
    process.exit(0);
  }
}

// Listen for termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2')); // nodemon restart

startServer();
