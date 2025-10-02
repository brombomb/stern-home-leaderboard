
// Data refresh interval in minutes (default: 60 minutes)
export const DATA_REFRESH_INTERVAL_MINUTES = parseInt(
  process.env.REACT_APP_DATA_REFRESH_INTERVAL_MINUTES,
  10,
) || 60;

// Grid columns for machines layout (default: 1 column)
export const GRID_COLUMNS = parseInt(
  process.env.REACT_APP_GRID_COLUMNS,
  10,
) || 1;
