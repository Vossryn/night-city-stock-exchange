import { redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

import { auth } from '@/lib/auth.server'

/**
 * Authentication check for server functions.
 * Returns the authenticated user or throws a redirect to login.
 *
 * Usage: const user = await requireAuth() at the start of protected server functions
 */
export const requireAuth = createServerFn({ method: 'GET' }).handler(
  async (_, ctx) => {
    const session = await auth.api.getSession({
      headers: ctx.request.headers,
    })

    if (!session?.user) {
      throw redirect({
        to: '/login',
        search: { redirect: ctx.request.url },
      })
    }

    return session.user
  },
)

/**
 * Gets the current authenticated user.
 * Returns null if not authenticated (does not redirect).
 */
export const getCurrentUser = createServerFn({ method: 'GET' }).handler(
  async (_, ctx) => {
    const session = await auth.api.getSession({
      headers: ctx.request.headers,
    })

    return session?.user || null
  },
)
