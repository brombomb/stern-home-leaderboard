# Development Guide

## Architecture

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

## Code Quality & Linting

This project uses ESLint to ensure consistent code quality and style across both frontend and backend codebases.

### ESLint Configuration

- **Frontend**: Uses ESLint 8 with React-specific rules and Create React App configuration
- **Backend**: Uses ESLint 9 with Node.js-specific rules and flat config format
- **Root**: Provides workspace-wide linting commands

### Running ESLint

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

## Project Structure
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
├── docs/                   # Documentation
└── docker-compose.yml      # Container orchestration
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Development Workflow

1. **Setup**: Follow the installation guide to get the development environment running
2. **Branch**: Create a feature branch from `main`
3. **Code**: Make your changes with appropriate tests
4. **Lint**: Run `npm run lint` to ensure code quality
5. **Test**: Test your changes in both development and Docker environments
6. **Document**: Update documentation if needed
7. **PR**: Submit a pull request with a clear description

### Code Style

- Write clear, descriptive variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Testing

- Ensure environment variables work correctly
