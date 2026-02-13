const express = require('express');

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
  continent: process.env.DEFAULT_CONTINENT || 'NA',
});

// Constants
const MAX_RETRIES = 2;

// Enhanced error class for API errors
class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

// Unified API client with retry logic
class SternApiClient {
  constructor() {
    this.defaultHeaders = {
      'User-Agent':
        'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:142.0) Gecko/20100101 Firefox/142.0',
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.5',
      Referer: 'https://insider.sternpinball.com/',
      'Content-Type': 'application/json',
      'Cache-Control': 'max-age=604800, no-cache, no-store',
      Origin: 'https://insider.sternpinball.com',
      DNT: '1',
      'Sec-GPC': '1',
      Connection: 'keep-alive',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'cross-site',
      Pragma: 'no-cache',
      Location: DEFAULT_LOCATION,
    };
  }

  createHeaders(req) {
    const headers = { ...this.defaultHeaders };

    if (req.cookies) {
      headers['Cookie'] = req.cookies;
    }

    if (req.authData?.token) {
      headers['Authorization'] = `Bearer ${req.authData.token}`;
    }

    return headers;
  }

  async logResponseError(response, context) {
    try {
      const errorBody = await response.clone().text();
      console.error(`${context} - Status ${response.status}:`, errorBody);
      return errorBody;
    } catch (logError) {
      console.error('Could not read error response body:', logError.message);
      return `Status ${response.status}`;
    }
  }

  async refreshAuthAndUpdateRequest(req) {
    const refreshed = await SternAuth.refreshAuth();
    if (refreshed) {
      req.authData = SternAuth.authData;
      req.cookies = SternAuth.cookies;
      return true;
    }
    console.error('Failed to refresh authentication');
    return false;
  }

  async makeRequest(url, req, retryCount = 0) {
    const headers = this.createHeaders(req);
    const response = await fetch(url, { headers });

    // Handle authentication errors with retry
    if (
      (response.status === 401 || response.status === 403) &&
      retryCount < MAX_RETRIES
    ) {
      console.log(
        `Received ${
          response.status
        } error, attempting to refresh authentication (retry ${
          retryCount + 1
        }/${MAX_RETRIES})`,
      );

      await this.logResponseError(response, 'Auth error');

      const authRefreshed = await this.refreshAuthAndUpdateRequest(req);
      if (authRefreshed) {
        return this.makeRequest(url, req, retryCount + 1);
      }

      throw new ApiError('Authentication expired and refresh failed', 401);
    }

    // Handle other errors
    if (!response.ok) {
      const errorBody = await this.logResponseError(response, 'API Error');
      throw new ApiError('API call failed', response.status, errorBody);
    }

    return response;
  }

  async fetchJson(url, req) {
    const response = await this.makeRequest(url, req);
    return response.json();
  }

  async handleApiRoute(url, req, res, errorMessage) {
    try {
      const data = await this.fetchJson(url, req);
      return res.json(data);
    } catch (error) {
      console.error(`${errorMessage}:`, error.message);

      if (error instanceof ApiError) {
        const statusCode = error.status === 401 ? 401 : 500;
        return res.status(statusCode).json({
          error: errorMessage,
          details: error.message,
          ...(error.status === 401 && {
            details: 'Please check your credentials',
          }),
        });
      }

      return res.status(500).json({
        error: errorMessage,
        details: error.message,
      });
    }
  }
}

// Create a single instance of the API client
const apiClient = new SternApiClient();

// Re-authentication endpoint
router.post('/reauth', async (req, res) => {
  try {
    const refreshed = await SternAuth.refreshAuth();
    if (refreshed) {
      res.json({ success: true, message: 'Re-authentication successful' });
    } else {
      res
        .status(401)
        .json({ success: false, error: 'Re-authentication failed' });
    }
  } catch (err) {
    console.error('Re-authentication error:', err.message);
    res.status(500).json({
      success: false,
      error: 'Re-authentication failed',
      details: err.message,
    });
  }
});

// Machines endpoint - protected by auth middleware
router.get('/machines', SternAuth.requireAuth, async (req, res) => {
  try {
    // First, fetch the basic machines list
    const machinesUrl = `${API_BASE_URL}/user_registered_machines/?group_type=home`;
    const machinesData = await apiClient.fetchJson(machinesUrl, req);
    const basicMachines = machinesData.user?.machines || [];

    // Now fetch detailed information for each machine to get tech alerts
    const detailedMachines = await Promise.allSettled(
      basicMachines.map(async (machine) => {
        try {
          const detailsUrl = `${API_BASE_URL}/game_machines/${machine.id}`;
          const detailsData = await apiClient.fetchJson(detailsUrl, req);

          // Merge basic machine data with detailed data, prioritizing detailed data
          return {
            ...machine,
            ...detailsData,
            // Preserve any fields from basic data that might not be in details
            model: machine.model || detailsData.model,
          };
        } catch (err) {
          console.error(
            `Failed to fetch details for machine ${machine.id}:`,
            err.message,
          );
          // Return basic machine data if details fetch fails
          return machine;
        }
      }),
    );

    // Extract successful results
    const successfulMachines = detailedMachines
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value);

    // Return the enhanced machines data in the same format as the original API
    res.json({
      ...machinesData,
      user: {
        ...machinesData.user,
        machines: successfulMachines,
      },
    });
  } catch (err) {
    console.error('Failed to fetch machines:', err.message);

    if (err instanceof ApiError && err.status === 401) {
      return res.status(401).json({
        error: 'Authentication expired and refresh failed',
        details: 'Please check your credentials',
      });
    }

    res.status(500).json({
      error: 'Failed to fetch machines',
      details: err.message,
    });
  }
});

// High scores endpoint - protected by auth middleware
router.get(
  '/high-scores/:machineId',
  SternAuth.requireAuth,
  async (req, res) => {
    const url = `${API_BASE_URL}/game_machine_high_scores/?machine_id=${req.params.machineId}`;
    await apiClient.handleApiRoute(
      url,
      req,
      res,
      'Failed to fetch high scores',
    );
  },
);

// Game teams endpoint to get avatars - protected by auth middleware
router.get(
  '/game-teams/:locationId',
  SternAuth.requireAuth,
  async (req, res) => {
    const url = `${GAME_TEAMS_API_URL}/game_teams/?location_id=${req.params.locationId}`;
    await apiClient.handleApiRoute(url, req, res, 'Failed to fetch game teams');
  },
);

// Machine details endpoint - protected by auth middleware
router.get(
  '/machine-details/:machineId',
  SternAuth.requireAuth,
  async (req, res) => {
    const url = `${API_BASE_URL}/game_machines/${req.params.machineId}`;
    await apiClient.handleApiRoute(
      url,
      req,
      res,
      'Failed to fetch machine details',
    );
  },
);

module.exports = router;
