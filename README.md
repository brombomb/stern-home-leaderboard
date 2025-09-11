<p align="center">
  <img src="frontend/public/pinball.svg" alt="Pinball Logo" width="80" height="80">
</p>

# Stern Home Leaderboard

A web application for displaying pinball machine high scores from Stern Pinball's home network. This application connects to Ste3. Use this ID to create direct links or bookmarks

## 🎨 Custom CSS Overrides

The application supports custom CSS overrides to personalize the appearance of your leaderboard. You can provide your own CSS file that will be loaded last, allowing you to override any existing styles.

### Setting Up Custom CSS

1. **Create your custom CSS file**

   Create a CSS file with your custom styles. For example, `my-custom-styles.css`:
   ```css
   /* Custom CSS overrides for Stern Home Leaderboard */

   /* Change the background color */
   body {
     background: linear-gradient(45deg, #1a1a2e, #16213e);
   }

   /* Customize machine card appearance */
   .machine-card {
     border: 2px solid #e53935;
     border-radius: 10px;
   }

   /* Change text colors */
   h1, h2, h3 {
     color: #ffd700;
   }

   /* Custom button styles */
   button {
     background: linear-gradient(45deg, #e53935, #ff6b6b);
   }
   ```

2. **Configure environment variable**

   Set the `CUSTOM_CSS_PATH` environment variable to point to your CSS file location inside the container:
   ```env
   CUSTOM_CSS_PATH=/app/custom-css/overrides.css
   ```

3. **Mount your CSS file using Docker volumes**

   Update your `docker-compose.yml` to mount your custom CSS file:
   ```yaml
   services:
     frontend:
       build: ./frontend
       ports:
         - "3000:3000"
       environment:
         - CUSTOM_CSS_PATH=/app/custom-css/overrides.css
       volumes:
         - /path/to/your/my-custom-styles.css:/app/custom-css/overrides.css:ro
       depends_on:
         - backend
   ```

4. **Start the application**
   ```bash
   docker-compose up --build
   ```

### How It Works

1. **Injection Process**: When the container starts, a script checks for the existence of the custom CSS file specified in `CUSTOM_CSS_PATH`
2. **Style Injection**: If found, the CSS content is injected into the HTML `<head>` section as a `<style>` tag
3. **Override Priority**: The custom CSS is loaded last, ensuring it can override any existing styles
4. **Dynamic Updates**: If you remove the custom CSS file and restart, the injected styles will be automatically removed

### Example Use Cases

- **Branding**: Apply your own color scheme and fonts
- **Theme Customization**: Create dark/light theme variations
- **Layout Adjustments**: Modify spacing, sizes, and positioning
- **Machine-Specific Styling**: Target specific machine cards with custom CSS classes
- **Tournament Mode**: Special styling for tournament displays
- **Accessibility**: Adjust colors and fonts for better visibility

### CSS Class Reference

The application uses semantic CSS class names that you can target:

- `.machine-card` - Individual machine display cards
- `.high-scores-table` - High scores table container
- `.player-info` - Player name and avatar display
- `.machine-status` - Online/offline status indicators
- `.error-message` - Error display component
- `.loader` - Loading spinner component

### Troubleshooting Custom CSS

- **Styles not applying**: Ensure the CSS file path is correct and the file is mounted properly
- **File not found**: Check the volume mount path and verify the file exists on the host
- **Override not working**: Use more specific CSS selectors or `!important` declarations
- **Changes not visible**: Rebuild the container with `docker-compose up --build`

For development, you can test CSS changes by temporarily editing the styles directly in your browser's developer tools before creating your custom CSS file.

## 🐳 Docker Deployments API to fetch machine data, high scores, and player avatars, presenting them in a clean, visual interface.

## 🎯 Features

- **Real-time High Scores**: Displays current high scores for all registered Stern pinball machines
- **Automatic Data Refresh**: Configurable periodic refresh of machine data and high scores
- **Player Avatars**: Shows player profile pictures and custom backgrounds from Stern's network
- **Machine Status**: Visual indicators for online/offline machine status
- **Game Branding**: Dynamic backgrounds and logos for each pinball machine
- **Fullscreen Mode**: Display individual machines in fullscreen for kiosks or dedicated displays
- **Responsive Design**: Works on desktop and mobile devices
- **Auto-authentication**: Handles Stern API authentication automatically with retry logic

## ☕ Support

If you find this project helpful, consider supporting my work:

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/Y8Y01L3NIG)

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

   # Optional: Frontend data refresh interval in minutes (default: 60)
   REACT_APP_DATA_REFRESH_INTERVAL_MINUTES=60

   # Optional: Custom CSS overrides file path (inside container)
   CUSTOM_CSS_PATH=/app/custom-css/overrides.css
   ```

3. **Start the application**
   ```bash
   docker-compose up
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Fullscreen mode: http://localhost:3000?machine=MACHINE_ID&fullscreen=true

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

### Code Quality & Linting

This project uses ESLint to ensure consistent code quality and style across both frontend and backend codebases.

#### ESLint Configuration

- **Frontend**: Uses ESLint 8 with React-specific rules and Create React App configuration
- **Backend**: Uses ESLint 9 with Node.js-specific rules and flat config format
- **Root**: Provides workspace-wide linting commands

#### Running ESLint

```bash
# Lint all projects from root
npm run lint

# Auto-fix issues where possible
npm run lint:fix

# Lint individual projects
cd frontend && npm run lint
cd backend && npm run lint

# Fix individual projects
cd frontend && npm run lint:fix
cd backend && npm run lint:fix
```

#### ESLint Rules Highlights

**Frontend (React)**:
- React hooks rules enforcement
- JSX accessibility checks
- Modern JavaScript standards (ES2022)
- Consistent code formatting
- React best practices

**Backend (Node.js)**:
- Node.js-specific rules
- Security best practices
- Modern JavaScript standards (ES2022)
- Error prevention rules
- Code style consistency

#### IDE Integration

For the best development experience, install ESLint extensions in your IDE:
- **VS Code**: ESLint extension by Microsoft
- **WebStorm**: Built-in ESLint support
- **Vim/Neovim**: ALE or CoC plugins

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

#### Frontend Configuration
- `REACT_APP_DATA_REFRESH_INTERVAL_MINUTES`: How often to automatically refresh machine data in minutes (default: 60)

> **⚠️ Important**: Setting the refresh interval too low (less than 30 minutes) may result in account lockouts from Stern's API due to rate limiting. Use conservative refresh intervals to avoid service interruptions.

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
6. **Fullscreen Mode**: Individual machines can be displayed fullscreen using query parameters

### Fullscreen Mode

Display any machine in fullscreen mode with multiple interaction methods:

#### Accessing Fullscreen Mode

1. **Click Game Logo**: Simply click on any game logo to enter fullscreen mode
2. **Direct URL**: Navigate directly using query parameters:
   ```
   http://localhost:3000?machine=MACHINE_ID&fullscreen=true
   ```
3. **Copy & Share**: Copy the current page URL when in fullscreen to share or bookmark specific machines

#### Exiting Fullscreen Mode

- **Click Game Logo**: Click the game logo again to exit fullscreen
- **Escape Key**: Press ESC to exit fullscreen mode
- **Exit Button**: Click the X button in the top-right corner

#### Features

- **Kiosk Mode**: Perfect for dedicated displays next to pinball machines
- **Auto-refresh**: Automatically fetches latest high scores
- **Responsive**: Adapts to any screen size
- **Shareable URLs**: Copy and paste URLs to go directly to specific machines in fullscreen

#### Usage Examples

- **Next to a machine**: `?machine=12345&fullscreen=true`
- **Sharing high scores**: Copy the URL and send to friends
- **Bookmarking favorites**: Save direct links to your favorite machines
- **Digital signage**: Display rotating machines on TVs or monitors
- **Tournament displays**: Show specific tournament machines
- **Home arcade displays**: Dedicated kiosk mode for home setups

#### Finding Machine IDs

To get a machine ID for direct URL access:
1. Click on any game logo to enter fullscreen
2. Copy the URL from your browser's address bar
3. The machine ID will be in the URL as `machine=XXXXX`
4. Use this ID to create direct links or bookmarks

## 🐳 Docker Deployment

### Environment Variables for Docker

When using Docker Compose, you can configure all environment variables in your `.env` file:

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
