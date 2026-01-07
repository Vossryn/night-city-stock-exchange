import { createFileRoute } from '@tanstack/react-router'

import { auth } from '@/lib/auth.server'

/**
 * Better Auth API route handler.
 * Handles all authentication endpoints: /api/auth/*
 *
 * Supported endpoints:
 * - /api/auth/signin/github
 * - /api/auth/signin/google
 * - /api/auth/callback/github
 * - /api/auth/callback/google
 * - /api/auth/signout
 * - /api/auth/session
 */
export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        return auth.handler(request)
      },
      POST: async ({ request }: { request: Request }) => {
        return auth.handler(request)
      },
    },
  },
})
