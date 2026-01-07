import { redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

/**
 * Authentication check for server functions.
 * Returns the authenticated user or throws an error/redirect.
 *
 * Usage: await requireAuth() at the start of protected server functions
 */
export const requireAuth = createServerFn({ method: 'GET' }).handler(
  async (ctx) => {
    const { getSessionFromHeaders } = await import('@/lib/auth.server')

    // Get session from request headers
    const session = await getSessionFromHeaders(ctx.request.headers)

    if (!session?.user) {
      throw redirect({ to: '/login' })
    }

    return session.user
  },
)

/**
 * Gets the current authenticated user.
 * Returns null if not authenticated.
 */
export const getCurrentUser = createServerFn({ method: 'GET' }).handler(
  async (ctx) => {
    const { getSessionFromHeaders } = await import('@/lib/auth.server')

    // Get session from request headers
    const session = await getSessionFromHeaders(ctx.request.headers)

    return session?.user || null
  },
)
