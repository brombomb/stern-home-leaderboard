#!/bin/sh

# Generate config.json from environment variables for runtime config
cat <<EOF > /usr/share/nginx/html/config.json
{
  "DATA_REFRESH_INTERVAL_MINUTES": ${DATA_REFRESH_INTERVAL_MINUTES:-60},
  "GRID_COLUMNS": ${GRID_COLUMNS:-1}
}
EOF

# Link all files from /app/data to Nginx static directory
mkdir -p /usr/share/nginx/html/app
ln -sfn /app/data /usr/share/nginx/html/app/data

exec nginx -g "daemon off;"
