
// Data refresh interval in minutes (default: 60 minutes)
export const DATA_REFRESH_INTERVAL_MINUTES = parseInt(
  import.meta.env.VITE_DATA_REFRESH_INTERVAL_MINUTES,
  10,
) || 60;

// Grid columns for machines layout (default: 1 column)
export const GRID_COLUMNS = parseInt(
  import.meta.env.VITE_GRID_COLUMNS,
  10,
) || 1;
