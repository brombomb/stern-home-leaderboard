# Stern Home Leaderboard

A web application for displaying pinball machine high scores from Stern Pinball's home network. This application connects to Stern's API to fetch machine data, high scores, and player avatars, presenting them in a clean, visual interface.

## 🎯 Features

- **Real-time High Scores**: Displays current high scores for all registered Stern pinball machines
- **Player Avatars**: Shows player profile pictures and custom backgrounds from Stern's network
- **Machine Status**: Visual indicators for online/offline machine status
- **Game Branding**: Dynamic backgrounds and logos for each pinball machine
- **Responsive Design**: Works on desktop and mobile devices
- **Auto-authentication**: Handles Stern API authentication automatically with retry logic

## 🏗️ Architecture

### Frontend (React)
- **Modern React**: Built with React 18 and functional components
- **Modular Components**: Clean component architecture for maintainability
- **Custom Hooks**: Centralized state management with custom hooks
- **Service Layer**: Dedicated API service for all backend communication

### Backend (Node.js/Express)
- **RESTful API**: Clean API endpoints for frontend consumption
- **Authentication**: Handles Stern API authentication and session management
- **Proxy Layer**: Securely proxies requests to Stern's API
- **Environment Configuration**: Configurable via environment variables

### Infrastructure
- **Docker Support**: Full containerization with Docker Compose
- **Development Mode**: Hot reload for both frontend and backend
- **Offline Mode**: Mock data support for development without API access

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Stern Pinball account credentials

### Setup

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
   ```

3. **Start the application**
   ```bash
   docker-compose up
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🛠️ Development

### Local Development

#### Frontend
```bash
cd frontend
npm install
npm start
```

#### Backend
```bash
cd backend
npm install
npm run dev
```

### Offline Development
For development without Stern API access:
```bash
cd backend
npm run dev-offline
```

### Project Structure
```
stern-home-leaderboard/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   └── services/        # API service layer
│   └── public/
├── backend/                 # Node.js backend
│   ├── auth.js             # Authentication logic
│   ├── routes.js           # API routes
│   ├── index.js            # Main server
│   ├── offline-server.js   # Development server with mock data
│   └── offline/            # Mock data files
└── docker-compose.yml      # Container orchestration
```

## 🔧 Configuration

### Environment Variables

#### Required
- `STERN_USERNAME`: Your Stern Pinball account username
- `STERN_PASSWORD`: Your Stern Pinball account password

#### Optional
- `DEFAULT_COUNTRY`: Default country code (default: "US")
- `DEFAULT_STATE`: Default state code (default: "CO")
- `DEFAULT_STATE_NAME`: Default state name (default: "Colorado")
- `DEFAULT_CONTINENT`: Default continent code (default: "NA")

### API Endpoints

The backend provides the following API endpoints:

- `POST /api/reauth` - Refresh authentication with Stern API
- `GET /api/machines` - Get all registered machines
- `GET /api/high-scores/:machineId` - Get high scores for a specific machine
- `GET /api/game-teams/:locationId` - Get player avatars for a location
- `GET /api/machine-details/:machineId` - Get detailed machine information

## 🎮 How It Works

1. **Authentication**: The backend authenticates with Stern's API using your credentials
2. **Machine Discovery**: Fetches all registered pinball machines from your account
3. **Score Fetching**: Retrieves high scores for each machine
4. **Avatar Loading**: Downloads player avatars and profile information
5. **Real-time Updates**: Displays everything in a responsive web interface

## 🐳 Docker Deployment

### Production Build
```bash
# Build and start containers
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

> **Note**: Environment variables can be configured in a `.env` file (see Configuration section above) or passed directly to docker-compose.

## 🧪 Development Features

### Offline Mode
The application includes an offline mode for development:
- Mock machine data
- Sample high scores
- Test player avatars
- No Stern API connection required

Start offline mode:
```bash
cd backend
npm run dev-offline
```

## 🎨 UI Components

### MachineCard
Displays individual pinball machines with:
- Game logo and background art
- Online/offline status indicator
- High scores table with player rankings
- Last played timestamp

### HighScoresTable
Shows ranked high scores with:
- Player avatars and names
- Formatted score values
- "GC" (Grand Champion) for #1 position

### PlayerInfo
Player display component featuring:
- Custom avatar images
- Personalized background colors
- Fallback to default pinball icon

## 🔄 API Integration

The application integrates with multiple Stern API endpoints:
- **CMS API**: Machine data and high scores
- **Portal API**: Game teams and avatars
- **Authentication API**: Session management

All API calls include automatic retry logic and re-authentication handling.

## 📱 Responsive Design

- **Desktop**: Full-width machine cards with detailed information
- **Tablet**: Responsive grid layout
- **Mobile**: Stacked card layout for easy scrolling

## 🚨 Troubleshooting

### Common Issues

1. **Authentication Failures**
   - Verify STERN_USERNAME and STERN_PASSWORD are correct
   - Check that your Stern account has machine access

2. **No Machines Displayed**
   - Ensure machines are registered to your Stern account
   - Check backend logs for API errors

3. **Missing Avatars**
   - Avatars depend on player profiles in Stern's system
   - Players must have uploaded avatars in their Stern accounts

4. **Connection Issues**
   - Verify internet connectivity
   - Check if Stern's API endpoints are accessible

### Debug Mode
Enable debug logging by setting:
```env
NODE_ENV=development
```

## 📄 License

This project is for personal use with Stern Pinball machines. Ensure compliance with Stern's API terms of service.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🔗 Related Links

- [Stern Pinball](https://sternpinball.com/)
- [Stern Insider Portal](https://insider.sternpinball.com/)

---

**Note**: This application requires a valid Stern Pinball account with registered machines to function properly.
