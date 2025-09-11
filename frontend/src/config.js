// Base API URL for backend server
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

// Data refresh interval in minutes (default: 60 minutes)
export const DATA_REFRESH_INTERVAL_MINUTES = parseInt(
  process.env.REACT_APP_DATA_REFRESH_INTERVAL_MINUTES,
  10,
) || 60;
