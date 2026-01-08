/**
 * Server functions for demo authentication
 * These are simple wrappers since we're using client-side mock auth
 */
import { createServerFn } from '@tanstack/react-start'

import type { DemoUser } from './mock-auth'

/**
 * Check if user is authenticated (client-side check)
 * Returns user or redirects to login
 */
export const requireAuth = createServerFn({ method: 'GET' }).handler(
  (): void => {
    // In demo mode, auth is handled client-side
    // This is just a placeholder for the server function pattern
    return
  },
)

/**
 * Get current user (handled client-side in demo mode)
 */
export const getCurrentUser = createServerFn({ method: 'GET' }).handler(
  (): DemoUser | null => {
    // Demo mode - auth state is client-side only
    return null
  },
)

/**
 * Get session (handled client-side in demo mode)
 */
export const getSession = createServerFn({ method: 'GET' }).handler(
  (): { user: DemoUser } | null => {
    // Demo mode - no server-side sessions
    return null
  },
)

/**
 * Sign out (handled client-side in demo mode)
 */
export const signOut = createServerFn({ method: 'POST' }).handler(
  (): { success: boolean } => {
    // Demo mode - logout happens client-side
    return { success: true }
  },
)
