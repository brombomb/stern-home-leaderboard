FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

# Create directory for custom CSS overrides
RUN mkdir -p /app/custom-css

EXPOSE 3000
CMD ["npm", "start"]
