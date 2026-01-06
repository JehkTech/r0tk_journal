# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project overview

R0TK Journal is a full-stack trading journal application:
- Frontend: React + TypeScript + Vite + Tailwind + shadcn-style UI in the repo root.
- Backend: Node.js + Express + TypeScript + lowdb JSON persistence in `backend/`.

The current frontend is largely a rich, mock-data UI; the backend exposes real APIs for authentication, trades, analytics, and screenshot uploads, but the UI is not yet wired to these APIs.

## Commands and workflows

### Frontend (Vite React app at repo root)

From the repo root (`r0tk_journal`):

- Install dependencies:
  - `npm install`

- Run the dev server (Vite):
  - `npm run dev`
  - Vite is configured to listen on port `3003` (see `vite.config.ts`).

- Run tests (Vitest + React Testing Library):
  - All tests: `npm test`
  - Single test file (example): `npm test -- src/App.test.tsx`

- Build and preview:
  - Production build: `npm run build` (outputs to `dist/`)
  - Preview built app: `npm run preview`

### Backend (Express API in `backend/`)

From `backend/`:

- Install dependencies:
  - `npm install`

- Environment setup (required before running):
  - Copy example env file and edit as needed:
    - `cp env.example .env`
  - Important variables (see `backend/README.md` and `backend/src/index.ts`):
    - `PORT` (default `3001`)
    - `NODE_ENV` (e.g. `development`)
    - `JWT_SECRET`
    - `DATABASE_PATH` (directory for the lowdb JSON file)
    - `UPLOAD_PATH` (directory for uploaded screenshots)
    - `MAX_FILE_SIZE` (bytes; default 10MB)
    - `CORS_ORIGIN` (frontend origin; update to match the Vite dev URL, e.g. `http://localhost:3003`)

- Run the API in development (tsx watcher):
  - `npm run dev`
  - The API listens on `http://localhost:$PORT` (default `http://localhost:3001`).
  - Health check: `GET /health`.

- Build and run in production mode:
  - Build TypeScript: `npm run build`
  - Start compiled server: `npm start`

- Run backend tests (Jest):
  - `npm test`
  - Jest is configured in `package.json` (`"test": "jest"`); add your test files under `backend/src` (e.g. `*.test.ts`) as needed.

### Typical local development flow

- Start backend API in one terminal:
  - `cd backend && npm run dev`
- Start frontend in another terminal from repo root:
  - `npm run dev`
- Frontend should call the API via `http://localhost:PORT/api/...` (e.g. `http://localhost:3001/api/auth/login`).

## High-level architecture

### Frontend structure (`src/`)

Entry and composition:
- `src/main.tsx`: React entry point; creates the root using `ReactDOM.createRoot`, imports global styles (`index.css`, `App.css`, `@/styles/globals.css`) and renders `<App />`.
- `src/App.tsx`: Top-level layout and view router. It:
  - Wraps the app in `SidebarProvider` from `components/ui/sidebar`.
  - Renders `Navigation` (sidebar) and a main content area.
  - Tracks `activeSection` in local state and switches between:
    - `Dashboard` (main KPIs and charts)
    - `TradeEntry` (trade logging form)
    - `Analytics` (performance/psychology/chakra views)
    - Inline placeholder views for Journal, Screenshots, Notes, and Settings.

Navigation and layout:
- `src/components/Navigation.tsx`:
  - Defines the left sidebar using `components/ui/sidebar` primitives.
  - Encodes high-level sections (`dashboard`, `new-trade`, `journal`, `analytics`, `settings`) and sub-items (e.g. `journal` → `all-trades`, `screenshots`, `notes`; `analytics` → `performance`, `risk`, `psychology`).
  - Notifies `App` via `onSectionChange`, which drives what content is rendered.

Feature surfaces:
- `src/components/Dashboard.tsx`:
  - Dashboard composed of KPI cards (P&L, win rate, average R:R, total trades), charts, and recent trades.
  - Uses mock arrays (`mockTradeData`, `recentTrades`) and Recharts for visualization.
  - Exposes an `onNavigate` callback to jump to `"new-trade"` when the user wants to add a trade.

- `src/components/TradeEntry.tsx`:
  - Comprehensive trade entry form: instrument, direction, lot size, prices, session, strategy, emotion, confidence slider, notes, and screenshot upload placeholder.
  - Uses internal `formData` state, computes a local risk:reward ratio from entry/SL/TP, but currently only logs submissions to `console` and resets the form; there is no API integration yet.

- `src/components/Analytics.tsx`:
  - Tabbed analytics view with three tabs: `performance`, `psychology`, and `chakra`.
  - Uses static/mock data arrays for:
    - Session performance (win rate, trades, profit by session).
    - Risk:reward distribution and common mistakes.
    - Emotional state distribution and its impact.
    - Chakra alignment metrics and recommendations.
  - Visualizations are implemented with Recharts and Tailwind CSS utility classes.

UI toolkit and styling:
- `src/components/ui/`: A large set of reusable shadcn-style primitives (e.g. `card`, `button`, `tabs`, `sidebar`, `dialog`, `form`, etc.). Most feature components compose these primitives rather than raw HTML.
- `vite.config.ts` defines a path alias `@` to `./src`, used for imports like `@/styles/globals.css`.
- `tailwind.config.js`:
  - Enables class-based dark mode.
  - Scans `./src/**/*.{js,jsx,ts,tsx}` for classes.
  - Extends the theme with CSS variable-driven colors (`background`, `foreground`, `primary`, etc.) and border radii.

Testing:
- `src/App.test.tsx`: Example frontend test file using Testing Library (see dev dependencies and `setupTests.ts`).
- `src/setupTests.ts`: Imports `@testing-library/jest-dom` so Vitest/Jest-style DOM matchers are available.

### Backend structure (`backend/src/`)

Server bootstrap:
- `backend/src/index.ts`:
  - Loads environment variables via `dotenv`.
  - Creates the Express app and configures security and infrastructure middleware:
    - `helmet` for headers.
    - `cors` with `origin` from `CORS_ORIGIN` (default `http://localhost:5173`) and `credentials: true`.
    - Rate limiting via `express-rate-limit` (100 requests per 15 minutes).
    - JSON and URL-encoded body parsers with 10MB limits.
  - Initializes the database via `DatabaseManager` and constructs:
    - `AuthService` for authentication and user management.
    - `TradeService` for trades and analytics.
  - Serves uploaded files from `UPLOAD_PATH` (default `./uploads`) under `/uploads`.
  - Defines a `/health` endpoint returning status, timestamp, and environment.
  - Mounts route modules:
    - `/api/auth` → `createAuthRoutes(authService, tradeService)`.
    - `/api/trades` → `createTradeRoutes(tradeService, authService, db)`.
  - Adds centralized error handling (including multer file-size and unexpected-file errors) and a catch-all 404 JSON handler.

Persistence and data model:
- `backend/src/database/index.ts`:
  - Wraps lowdb/JSONFile into `DatabaseManager`.
  - Schema includes collections for `users`, `trades`, `screenshots`, and `analytics_cache` with typed fields (e.g. trades store pair, side, lot size, entry/exit, SL/TP, session, emotion, confidence, PnL, and timestamps).
  - Computes next IDs for each collection and exposes `getDb()` for direct lowdb access.

Domain services:
- `backend/src/services/AuthService.ts`:
  - Operates on the `users` collection.
  - `register`: validates uniqueness (username/email), hashes passwords with bcrypt (12 rounds), persists a new user.
  - `login`: finds by username or email, verifies password, issues JWT (`userId`, `username`, `exp=7d`) using `JWT_SECRET` (or a fallback in development), and strips the password hash from the returned user.
  - `getUserById`, `updateUser`, and `changePassword` implement basic profile management.
  - `verifyToken` wraps JWT verification and returns a normalized `{ userId, username }` payload or `null` on failure.

- `backend/src/services/TradeService.ts`:
  - Operates on the `trades` (and indirectly `screenshots`) collections.
  - `createTrade`:
    - Accepts a `CreateTradeRequest` payload.
    - Optionally computes PnL from entry/exit, side, and lot size (assumes a standard FX lot calculation) and persists the trade.
  - `getTrades`:
    - Filters by user, pair, session, emotion, strategy, date range, and PnL range.
    - Applies pagination via `limit` and `offset` and sorts by `trade_date` descending.
  - `getTradeById`, `updateTrade`, `deleteTrade`: per-user CRUD around the trade ID.
  - `getDashboardStats`:
    - Aggregates total PnL, win rate, average risk:reward (based on SL/TP), 6-month monthly performance, and a recent trades list.
  - `getAnalyticsData`:
    - Builds analytics payloads such as session performance, emotion distribution, and mock risk:reward/mistake/chakra data that mirror the structures used in the frontend `Analytics` component.

Routing and HTTP layer:
- `backend/src/routes/auth.ts`:
  - Defines authentication and user-related endpoints:
    - `POST /api/auth/register` (user creation with validation and conflict handling).
    - `POST /api/auth/login` (returns `{ user, token }`).
    - `GET /api/auth/profile` and `PUT /api/auth/profile` (JWT-protected profile read/update).
    - `PUT /api/auth/password` (JWT-protected password change with validation).
    - `GET /api/auth/dashboard` (JWT-protected dashboard stats via `TradeService`).
    - `GET /api/auth/analytics` (JWT-protected analytics data via `TradeService`).

- `backend/src/routes/trades.ts`:
  - Configures multer storage for screenshots with:
    - Destination: `UPLOAD_PATH` (env or `./uploads`), created if missing.
    - Filenames: `fieldname-<timestamp>-<random>.<ext>`.
    - File size limit from `MAX_FILE_SIZE` (default 10MB).
    - MIME/type filtering for JPEG/PNG/GIF/WebP.
  - Defines trade endpoints (all JWT-protected):
    - `GET /api/trades` with extensive query filters and pagination.
    - `GET /api/trades/:id` for a single trade.
    - `POST /api/trades` for trade creation with validation.
    - `PUT /api/trades/:id` for trade update with validation.
    - `DELETE /api/trades/:id` for deletion.
    - `POST /api/trades/:id/screenshots` for uploading up to 5 screenshots per trade; metadata is stored in the `screenshots` collection via the shared lowdb instance.

Middleware and validation:
- `backend/src/middleware/auth.ts`:
  - `authenticateToken(authService)`: Express middleware extracting a Bearer token from the `Authorization` header, verifying it via `AuthService`, and attaching the decoded user object to `req.user` (or returning 401/403 on failure).
  - `handleValidationErrors`: wraps `express-validator` to return a structured 400 JSON response if validation fails.
  - `validateTrade`, `validateUser`, `validateLogin`, `validatePasswordChange`: reusable validation rule sets for the respective endpoints.

Types and shared definitions:
- `backend/src/types/`: Shared TypeScript interfaces and types for users, trades, filters, analytics payloads, etc., used by `AuthService`, `TradeService`, and route handlers.

## Notable integration details and caveats

- CORS vs frontend URL: `backend/src/index.ts` defaults `CORS_ORIGIN` to `http://localhost:5173`, but Vite is explicitly configured to run on port `3003`. Update `CORS_ORIGIN` in `.env` to match the actual frontend URL (`http://localhost:3003`) to avoid CORS issues during local development.
- Frontend data sources: Dashboard, Analytics, and Journal components currently use hard-coded mock data. When integrating with the backend, expect to replace these mocks with API calls to `/api/auth/dashboard`, `/api/auth/analytics`, and `/api/trades`.
- Persistence: The database is JSON-file based (lowdb) and the path is controlled via `DATABASE_PATH`. In development, you may want to point this to a repo-local `./data` directory and add it to `.gitignore` if not already ignored.
