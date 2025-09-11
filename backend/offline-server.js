require('dotenv').config();
const express = require('express');
const cors = require('cors');
const offlineRoutes = require('./offline-routes');

const app = express();

// Middleware
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());

// Use offline routes instead of regular API routes
app.use('/api', offlineRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    mode: 'offline',
    message: 'Offline development server running',
  });
});

const PORT = process.env.OFFLINE_PORT || 5000;

app.listen(PORT, () => {
  console.log(`🔌 Offline backend server listening on port ${PORT}`);
  console.log('📁 Serving offline data from ./offline/ folder');
  console.log('🌐 CORS enabled for http://localhost:3000');
  console.log('💡 No authentication required in offline mode');
});

module.exports = app;
