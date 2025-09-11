FROM node:18-alpine AS build
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

# Set production environment and build
ENV NODE_ENV=production
RUN npm run build

# Production stage - serve with nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Create directory for custom CSS overrides
RUN mkdir -p /usr/share/nginx/html/data

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
