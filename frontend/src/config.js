


// Runtime config loader and getter

const DEFAULT_CONFIG = {
  DATA_REFRESH_INTERVAL_MINUTES: 60,
  GRID_COLUMNS: 1,
  // add more defaults as needed
};

let config = null;

export async function loadRuntimeConfig() {
  if (!config) {
    const res = await fetch('/config.json');
    let loaded = {};
    if (res.ok) {
      loaded = await res.json();
    } else {
      console.warn('Failed to load config.json, using defaults only');
    }
    config = { ...DEFAULT_CONFIG, ...loaded };
    console.log('[Config] Loaded config:', config);
  }
  return config;
}

export function getConfig() {
  if (!config) throw new Error('Config not loaded yet. Call loadRuntimeConfig() before using getConfig().');
  return config;
}
