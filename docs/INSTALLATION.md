# Installation Guide

## Prerequisites
- Docker and Docker Compose
- Stern Pinball account credentials

## Quick Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd stern-home-leaderboard
   ```

2. **Configure environment variables**

   Create a `.env` file in the project root:
   ```env
   # Required: Stern Pinball credentials
   STERN_USERNAME=your_stern_username
   STERN_PASSWORD=your_stern_password

   # Optional: Default location (defaults to Colorado, USA)
   DEFAULT_COUNTRY=US
   DEFAULT_STATE=CO
   DEFAULT_STATE_NAME=Colorado
   DEFAULT_CONTINENT=NA

   # Optional: Frontend data refresh interval in minutes (default: 60)
   REACT_APP_DATA_REFRESH_INTERVAL_MINUTES=60

   # Optional: Custom CSS overrides file path (inside container)
   CUSTOM_CSS_PATH=/app/custom-css/overrides.css
   ```

3. **Start the application**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5100
   - Fullscreen mode: http://localhost:3000?machine=MACHINE_ID&fullscreen=true

## Environment Variables

### Required
- `STERN_USERNAME`: Your Stern Pinball account username
- `STERN_PASSWORD`: Your Stern Pinball account password

### Optional
- `DEFAULT_COUNTRY`: Default country code (default: "US")
- `DEFAULT_STATE`: Default state code (default: "CO")
- `DEFAULT_STATE_NAME`: Default state name (default: "Colorado")
- `DEFAULT_CONTINENT`: Default continent code (default: "NA")

### Frontend Configuration
- `REACT_APP_GRID_COLUMNS`: Number of columns for machine card layout (default: 1)
  - `1`: Single column layout (default)
  - `2`: Two columns side by side
  - `3`: Three columns side by side
  - `4+`: Four or more columns (automatically reduced on smaller screens)
- `REACT_APP_DATA_REFRESH_INTERVAL_MINUTES`: How often to automatically refresh machine data in minutes (default: 60)

> **⚠️ Important**: Setting the refresh interval too low (less than 30 minutes) may result in account lockouts from Stern's API due to rate limiting. Use conservative refresh intervals to avoid service interruptions.

## Docker Deployment

### Environment Variables for Docker

When using Docker Compose, you can configure all environment variables in your `.env` file, or use the [docker-compose.yaml](/docker-compose.yml) file:

```env
# Required: Stern Pinball credentials
STERN_USERNAME=your_stern_username
STERN_PASSWORD=your_stern_password

# Optional: Default location (defaults to Colorado, USA)
DEFAULT_COUNTRY=US
DEFAULT_STATE=CO
DEFAULT_STATE_NAME=Colorado
DEFAULT_CONTINENT=NA

# Optional: Frontend data refresh interval in minutes (default: 60)
REACT_APP_DATA_REFRESH_INTERVAL_MINUTES=60

# Optional: Custom CSS overrides file path (inside container)
CUSTOM_CSS_PATH=/app/custom-css/overrides.css
```

### Production Build
```bash
# Build and start containers
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

> **Note**: Environment variables can be configured in a `.env` file or passed directly to docker-compose.

## Local Development

### Frontend
```bash
cd frontend
npm install
npm start
```

### Backend
```bash
cd backend
npm install
npm run dev
```
