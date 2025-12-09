#!/bin/sh

# Generate config.json from environment variables for runtime config
# Accept both new and legacy VITE_ prefixed variables for compatibility
DATA_REFRESH_INTERVAL="${DATA_REFRESH_INTERVAL_MINUTES:-${VITE_DATA_REFRESH_INTERVAL_MINUTES:-60}}"
GRID_COLS="${GRID_COLUMNS:-${VITE_GRID_COLUMNS:-1}}"
cat <<EOF > /usr/share/nginx/html/config.json
{
  "DATA_REFRESH_INTERVAL_MINUTES": ${DATA_REFRESH_INTERVAL},
  "GRID_COLUMNS": ${GRID_COLS}
}
EOF

# Link all files from /app/data to Nginx static directory
mkdir -p /usr/share/nginx/html/app
ln -sfn /app/data /usr/share/nginx/html/app/data

exec nginx -g "daemon off;"
