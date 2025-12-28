# TanStack Start + shadcn/ui

This is a template for a new TanStack Start project with React, TypeScript, and shadcn/ui.

## Environment Variables

This project uses environment variables for configuration. You can set them in a `.env` file in the root directory.

Copy `.env.example` to `.env` to get started:

```bash
cp .env.example .env
```

### Available Variables

- `VITE_APP_TITLE`: The title of the application (default: "Night City Stock Exchange").
- `VITE_INITIAL_CASH`: The starting cash for a new user (default: 10000).
- `VITE_MARKET_TICK_RATE`: The interval in milliseconds for market updates (default: 5000).
- `VITE_ENABLE_DEBUG_TOOLS`: Enable debug tools for development (default: false).

You can access these variables in the code using `src/lib/config.ts`.
