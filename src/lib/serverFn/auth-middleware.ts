import { createServerFn } from '@tanstack/react-start'

/**
 * Authentication check for server functions.
 * Returns the authenticated user or throws an error/redirect.
 * TODO: Replace with proper server-side session/cookie validation.
 * 
 * Usage: await requireAuth() at the start of protected server functions
 */
export const requireAuth = createServerFn({ method: 'GET' }).handler(
  async () => {
    // TODO: Implement proper server-side session validation
    // const session = await getSession()
    // if (!session?.userId) {
    //   throw redirect({ to: '/login' })
    // }
    // const user = await getUserById(session.userId)
    // return user
    
    // Placeholder: Always passes for now
    // In production, implement real session validation above
    return { authenticated: true }
  },
)

/**
 * Gets the current authenticated user.
 * Returns null if not authenticated.
 * TODO: Replace with proper server-side user extraction from session.
 */
export const getCurrentUser = createServerFn({ method: 'GET' }).handler(
  async () => {
    // TODO: Extract user from session/cookie
    // const session = await getSession()
    // if (!session?.userId) return null
    // return await getUserById(session.userId)
    
    return null
  },
)
