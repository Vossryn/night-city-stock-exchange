import { createServerFn } from '@tanstack/react-start'

import { auth } from '@/lib/auth.server'

/**
 * Get the current authenticated session from better-auth.
 * Returns the session or null if not authenticated.
 */
export const getSession = createServerFn({ method: 'GET' }).handler(
  async (_, ctx) => {
    const session = await auth.api.getSession({
      headers: ctx.request.headers,
    })

    return session
  },
)

/**
 * Sign out the current user by invalidating their session.
 */
export const signOut = createServerFn({ method: 'POST' }).handler(
  async (_, ctx) => {
    await auth.api.signOut({
      headers: ctx.request.headers,
    })

    return { success: true }
  },
)

/**
 * Get the current authenticated user with full profile.
 */
export const getCurrentUser = createServerFn({ method: 'GET' }).handler(
  async (_, ctx) => {
    const session = await auth.api.getSession({
      headers: ctx.request.headers,
    })

    if (!session?.user) {
      return null
    }

    return session.user
  },
)
