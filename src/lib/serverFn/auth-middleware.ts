import { redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'

import { auth } from '@/lib/auth.server'

interface AuthUser {
  id: string
  createdAt: Date
  updatedAt: Date
  email: string
  emailVerified: boolean
  name: string
  image?: string | null
}

/**
 * Authentication check for server functions.
 * Returns the authenticated user or throws a redirect to login.
 *
 * Usage: const user = await requireAuth() at the start of protected server functions
 */
export const requireAuth = createServerFn({ method: 'GET' }).handler(
  async (): Promise<AuthUser> => {
    const request = getRequest()
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session?.user) {
      throw redirect({
        to: '/login',
        search: { redirect: request.url },
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
  async (): Promise<AuthUser | null> => {
    const request = getRequest()
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    return session?.user || null
  },
)
