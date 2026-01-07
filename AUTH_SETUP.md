# Authentication Setup

This document explains the server-side authentication implementation using better-auth.

## Overview

The application now uses **better-auth** for server-side session management with OAuth providers (GitHub and Google). The TODO items in `src/lib/serverFn/auth-middleware.ts` have been addressed with proper session validation.

## What Changed

### 1. Database Schema

Added authentication tables to `src/db/schema.ts`:

- `user` - Stores user information from OAuth providers
- `session` - Stores active user sessions
- `account` - Stores OAuth provider account data
- `verification` - Stores verification tokens

### 2. Configuration

Updated `src/lib/config.ts` to include:

- `BETTER_AUTH_SECRET` - Secret key for session encryption (min 32 characters)
- `BETTER_AUTH_URL` - Base URL for the application (default: http://localhost:3000)

### 3. Auth Server Module

Created `src/lib/auth.server.ts`:

- Configures better-auth with GitHub and Google OAuth providers
- Exports `getSessionFromHeaders()` helper for session validation
- Uses Drizzle adapter for SQLite database

### 4. Server Functions

Updated `src/lib/serverFn/auth-middleware.ts`:

- `requireAuth()` - Validates session and returns authenticated user or redirects to login
- `getCurrentUser()` - Returns authenticated user or null

### 5. Database Queries

Added to `src/lib/db-queries.server.ts`:

- `getUserById(userId)` - Get user by ID
- `getUserByEmail(email)` - Get user by email

## Setup Instructions

### 1. Environment Variables

Copy `.env.example` to `.env` and update the following:

```bash
# Better Auth Configuration
BETTER_AUTH_SECRET=your-secret-key-at-least-32-characters-long
BETTER_AUTH_URL=http://localhost:3000

# OAuth Provider Credentials
VITE_GITHUB_CLIENT_ID=your-github-client-id
VITE_GITHUB_CLIENT_SECRET=your-github-client-secret
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 2. Database Migration

Run the migration to create authentication tables:

```bash
npx tsx src/db/migrate.ts
```

### 3. OAuth Provider Setup

#### GitHub OAuth

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL to: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Client Secret to `.env`

#### Google OAuth

1. Go to Google Cloud Console
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Set Authorized redirect URI to: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env`

## Usage

### Server Functions

Use `requireAuth()` in protected server functions:

```typescript
import { createServerFn } from '@tanstack/react-start'
import { requireAuth } from '@/lib/serverFn'

export const getProtectedData = createServerFn({ method: 'GET' }).handler(
  async (ctx) => {
    // This will redirect to /login if not authenticated
    const user = await requireAuth()

    // User is authenticated, proceed with logic
    return { data: 'protected', userId: user.id }
  },
)
```

Use `getCurrentUser()` for optional authentication:

```typescript
import { createServerFn } from '@tanstack/react-start'
import { getCurrentUser } from '@/lib/serverFn'

export const getPublicData = createServerFn({ method: 'GET' }).handler(
  async (ctx) => {
    // Returns user or null
    const user = await getCurrentUser()

    return {
      data: 'public',
      personalizedFor: user?.name || 'Guest',
    }
  },
)
```

### Client-Side Integration

The client-side `useAuthStore` (Zustand) remains for UI state management. To integrate with server-side auth:

1. After OAuth login, better-auth sets a session cookie
2. Update client state to reflect authentication status
3. Server functions automatically validate the session cookie

## Architecture

- **Client**: Zustand store (`src/lib/auth-store.ts`) for UI state
- **Server**: better-auth for session management and validation
- **Database**: SQLite with Drizzle ORM for user/session storage
- **Sessions**: Cookie-based with secure, httpOnly flags

## Security Notes

- Session cookies are httpOnly and secure in production
- `BETTER_AUTH_SECRET` must be at least 32 characters and kept secret
- Server functions validate sessions on every request
- Client-side auth store is for UI only and should not be trusted for authorization
