


// Vite exposes VITE_* env vars at build time via import.meta.env
// This config loader uses those, falling back to defaults if not set

export function getConfig() {
  console.log('meta.env', import.meta.env);
  return {
    DATA_REFRESH_INTERVAL_MINUTES:
      Number(import.meta.env.VITE_DATA_REFRESH_INTERVAL_MINUTES) || 60,
    GRID_COLUMNS:
      Number(import.meta.env.VITE_GRID_COLUMNS) || 1,
  };
}
