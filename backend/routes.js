const express = require('express');
const fetch = require('node-fetch');
const SternAuth = require('./auth');
const router = express.Router();

// Constants
const API_BASE_URL = 'https://cms.prd.sternpinball.io/api/v1/portal';
const GAME_TEAMS_API_URL = 'https://api.prd.sternpinball.io/api/v1/portal';

// Create default location from environment variables
const DEFAULT_LOCATION = JSON.stringify({
  country: process.env.DEFAULT_COUNTRY || 'US',
  state: process.env.DEFAULT_STATE || 'CO',
  stateName: process.env.DEFAULT_STATE_NAME || 'Colorado',
  continent: process.env.DEFAULT_CONTINENT || 'NA'
});

// Helper function to create standard headers
const createHeaders = (req) => {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:142.0) Gecko/20100101 Firefox/142.0',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.5',
    'Referer': 'https://insider.sternpinball.com/',
    'Content-Type': 'application/json',
    'Cache-Control': 'max-age=604800, no-cache, no-store',
    'Origin': 'https://insider.sternpinball.com',
    'DNT': '1',
    'Sec-GPC': '1',
    'Connection': 'keep-alive',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'cross-site',
    'Pragma': 'no-cache',
    'Location': DEFAULT_LOCATION
  };

  if (req.cookies) {
    headers['Cookie'] = req.cookies;
  }

  if (req.authData?.token) {
    headers['Authorization'] = `Bearer ${req.authData.token}`;
  }

  return headers;
};

// Helper function for making API calls with automatic retry on 403
const makeApiCall = async (url, req, res, errorMessage, retryCount = 0) => {
  const MAX_RETRIES = 2;

  try {
    const headers = createHeaders(req);
    const response = await fetch(url, { headers });

    // Handle 403 Forbidden - likely authentication issue
    if (response.status === 403 && retryCount < MAX_RETRIES) {
      console.log(`Received 403 response, attempting to refresh auth (retry ${retryCount + 1}/${MAX_RETRIES})`);

      // Attempt to refresh authentication
      const refreshed = await SternAuth.refreshAuth();
      if (refreshed) {
        console.log('Authentication refreshed, retrying API call...');

        // Update request with new auth data
        req.authData = SternAuth.authData;
        req.cookies = SternAuth.cookies;

        // Retry the API call
        return makeApiCall(url, req, res, errorMessage, retryCount + 1);
      } else {
        console.error('Failed to refresh authentication after 403 response');
        return res.status(401).json({
          error: 'Authentication expired and refresh failed',
          details: 'Please check your credentials'
        });
      }
    }

    if (!response.ok) {
      throw new Error(`API call failed with status ${response.status}`);
    }

    const data = await response.json();
    return res.json(data);
  } catch (err) {
    console.error(`${errorMessage}:`, err.message);

    // If this was a retry attempt, provide more context
    if (retryCount > 0) {
      console.error(`Failed after ${retryCount} retry attempts`);
    }

    return res.status(500).json({
      error: errorMessage,
      details: err.message,
      retryAttempts: retryCount
    });
  }
};

// Re-authentication endpoint
router.post('/reauth', async (req, res) => {
  try {
    const refreshed = await SternAuth.refreshAuth();
    if (refreshed) {
      res.json({ success: true, message: 'Re-authentication successful' });
    } else {
      res.status(401).json({ success: false, error: 'Re-authentication failed' });
    }
  } catch (err) {
    console.error('Re-authentication error:', err.message);
    res.status(500).json({
      success: false,
      error: 'Re-authentication failed',
      details: err.message
    });
  }
});

// Machines endpoint - protected by auth middleware
router.get('/machines', SternAuth.requireAuth, async (req, res) => {
  const url = `${API_BASE_URL}/user_registered_machines/?group_type=home`;
  await makeApiCall(url, req, res, 'Failed to fetch machines');
});

// High scores endpoint - protected by auth middleware
router.get('/high-scores/:machineId', SternAuth.requireAuth, async (req, res) => {
  const url = `${API_BASE_URL}/game_machine_high_scores/?machine_id=${req.params.machineId}`;
  await makeApiCall(url, req, res, 'Failed to fetch high scores');
});

// Game teams endpoint to get avatars - protected by auth middleware
router.get('/game-teams/:locationId', SternAuth.requireAuth, async (req, res) => {
  const url = `${GAME_TEAMS_API_URL}/game_teams/?location_id=${req.params.locationId}`;
  await makeApiCall(url, req, res, 'Failed to fetch game teams');
});

// Machine details endpoint - protected by auth middleware
router.get('/machine-details/:machineId', SternAuth.requireAuth, async (req, res) => {
  const url = `${API_BASE_URL}/game_machines/${req.params.machineId}`;
  await makeApiCall(url, req, res, 'Failed to fetch machine details');
});

module.exports = router;
