


// Vite exposes VITE_* env vars at build time via import.meta.env
// This config loader uses those, falling back to defaults if not set

export function getConfig() {
  // Vite provides VITE_* env vars via import.meta.env at build time
  const raw = import.meta.env || {};
  const disableAuto =
    raw.VITE_DISABLE_AUTOSCROLL === 'true' || raw.VITE_DISABLE_AUTOSCROLL === '1' || raw.VITE_DISABLE_AUTOSCROLL === true;

  return {
    DATA_REFRESH_INTERVAL_MINUTES: Number(raw.VITE_DATA_REFRESH_INTERVAL_MINUTES) || 60,
    GRID_COLUMNS: Number(raw.VITE_GRID_COLUMNS) || 1,
    DISABLE_AUTOSCROLL: Boolean(disableAuto),
  };
}
