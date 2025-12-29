# Night City Stock Exchange - Copilot Instructions

## Project Context
Night City Stock Exchange is a Cyberpunk-themed single-player stock market simulation game.
- **Stack**: React 19, TanStack Start, TanStack Router, Tailwind CSS v4, shadcn/ui.
- **State**: Zustand for global store (portfolio, market state).
- **Auth**: better-auth (Stateless Mode / JWT).
- **Testing**: Vitest + React Testing Library.

## Architecture & Patterns

### 1. Routing (TanStack Router)
- **File-based Routing**: Routes are defined in `src/routes`.
- **Root Layout**: `src/routes/__root.tsx` handles the main layout and providers.
- **Navigation**: Use `Link` component or `useNavigate` hook from `@tanstack/react-router`.
- **Data Loading**: Prefer loaders in route files for data fetching requirements.

### 2. Configuration
- **Strict Separation**: Configuration is split into `clientConfig` and `serverConfig` in `src/lib/config.ts`.
- **Usage**:
  - Import `clientConfig` for UI components.
  - Import `serverConfig` ONLY for server-side functions (SSR/API).
  - **Never** expose secrets in `clientConfig`.

### 3. Styling & UI
- **Framework**: Tailwind CSS v4 with `shadcn/ui` components in `src/components/ui`.
- **Theme**: Cyberpunk aesthetic (Dark mode, Neon Blue/Pink/Yellow, High Contrast).
- **Icons**: `lucide-react`.
- **Class Merging**: Use `cn()` utility from `src/lib/utils.ts` for conditional classes.

### 4. State Management
- **Global State**: Use `zustand` for managing:
  - User Portfolio (Cash, Holdings).
  - Market State (Current Prices, History).
  - Game Time/Ticks.
- **Persistence**: Game state should persist to `localStorage` (unless superseded by backend).

### 5. Market Simulation
- **Tick System**: The market updates based on a "tick" interval defined in `VITE_MARKET_TICK_RATE`.
- **Data**: Company static data is in `src/lib/company-data.ts`.

### 6. Authentication
- **Library**: `better-auth` in **Stateless Mode**.
- **Mechanism**: JWT-based authentication. No database sessions.
- **Client**: Use the `better-auth` client hooks for user state.
- **Server**: Verify tokens in API routes/server functions using the secret key.

## Developer Workflow

### Commands
- **Start Dev Server**: `npm run dev` (Port 3000)
- **Run Tests**: `npm test` (Vitest)
- **Lint & Format**: `npm run check`

### Testing Guidelines
- Write unit tests for market logic and utility functions.
- Use `render` from `@testing-library/react` for component tests.
- Mock `zustand` stores when testing components that rely on global state.

## Key Files
- `src/lib/config.ts`: Environment configuration.
- `src/routes/__root.tsx`: Application shell.
- `src/lib/company-data.ts`: Static definitions for companies.
- `vite.config.ts`: Build configuration (TanStack Start, Tailwind, etc.).
