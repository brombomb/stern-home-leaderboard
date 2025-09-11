require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const apiRoutes = require('./routes');
const SternAuth = require('./auth');

const app = express();

// Middleware
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(session({
  secret: 'stern-leaderboard-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }, // Set to true if using HTTPS
}));

// Routes
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5000;

// Initialize authentication and start server
async function startServer() {
  try {
    // Try to initialize authentication on startup
    await SternAuth.initializeAuth();

    app.listen(PORT, () => {
      console.log(`Backend listening on port ${PORT}`);
      console.log('Server started successfully');
    });
  } catch (error) {
    console.error('Error during startup:', error);
    // Start server anyway - authentication will be retried on API calls
    app.listen(PORT, () => {
      console.log(`Backend listening on port ${PORT}`);
      console.log('Server started with authentication issues - will retry on API calls');
    });
  }
}

startServer();
