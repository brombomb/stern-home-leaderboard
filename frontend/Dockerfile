FROM node:22-alpine AS build
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

# Accept build arguments and create .env file for Vite
ARG VITE_DATA_REFRESH_INTERVAL_MINUTES=60
ARG VITE_GRID_COLUMNS=1
ARG VITE_DISABLE_AUTOSCROLL=false

# Create .env file that Vite will read during build
RUN echo "VITE_DATA_REFRESH_INTERVAL_MINUTES=${VITE_DATA_REFRESH_INTERVAL_MINUTES}" > .env && \
    echo "VITE_GRID_COLUMNS=${VITE_GRID_COLUMNS}" >> .env && \
    echo "VITE_DISABLE_AUTOSCROLL=${VITE_DISABLE_AUTOSCROLL}" >> .env

# Set production environment and build
ENV NODE_ENV=production
RUN npm run build

# Production stage - serve with nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy entrypoint script for runtime config
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]
