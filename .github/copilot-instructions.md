# Copilot Instructions for AI Coding Agents

## Project Overview
- **Stern Home Leaderboard** is a full-stack web app for displaying pinball machine high scores from Stern Pinball's home network.
- **Frontend:** React 18 (in `frontend/`), modular components, custom hooks, and a service layer for API calls.
- **Backend:** Node.js/Express (in `backend/`), acts as a secure proxy to Stern's API, handles authentication/session, and exposes RESTful endpoints for the frontend.
- **Docker:** Containerized with `docker-compose.yml` for easy deployment and local development.

## Key Workflows
- **Local Dev:**
  - Frontend: `cd frontend && npm install && npm start`
  - Backend: `cd backend && npm install && npm run dev`
  - Lint all: `npm run lint` (from root)
  - Lint/fix: `npm run lint:fix` (from root)
- **Docker:**
  - Start all: `docker-compose up --build`
  - Custom CSS: Use `examples/docker-compose-with-custom-css.yml` and mount a `data/` volume for overrides.
- **Environment:**
  - Copy `.env.example` to `.env` and fill in Stern credentials for backend auth.
  - Offline mode: `npm run offline` in backend for mock data (see `backend/offline-server.js`).

## Architecture & Patterns
- **Frontend:**
  - All API calls go through `frontend/src/services/apiService.js`.
  - State/data for machines/high scores managed via `frontend/src/hooks/useMachinesData.js`.
  - UI is composed of modular components in `frontend/src/components/`.
  - Fullscreen mode and machine selection via URL query params (see `utils/queryParams.js`).
- **Backend:**
  - Auth/session logic in `backend/auth.js`.
  - API proxy logic and error handling in `backend/routes.js` (see `SternApiClient`).
  - Mock/offline data support in `backend/offline-server.js` and `backend/offline/`.
  - All environment config via `.env`.

## Conventions & Tips
- **Custom Styling:** Place overrides in `data/custom.css` and mount as a Docker volume.
- **API Integration:** Never call Stern's API directly from the frontend; always use backend proxy.
- **Error Handling:** Backend retries auth on 401/403, returns clear error JSON.
- **Component Structure:** Prefer small, focused React components; use hooks for shared logic.
- **Testing:** No formal test suite; manual testing via dev servers and Docker is standard.

## References
- See `docs/DEVELOPMENT.md` for dev workflow, architecture, and project structure.
- See `examples/README.md` for custom CSS and Docker usage patterns.
- See `README.md` for quick start and feature overview.

---

*Update this file if you introduce new workflows, major refactors, or change integration patterns.*
