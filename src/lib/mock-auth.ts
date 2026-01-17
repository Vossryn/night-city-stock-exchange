/**
 * Mock Authentication System for Demo
 * Thin facade over useAuthStore - ensures single source of truth
 *
 * This module re-exports types and provides a simple API for:
 * - Route guards (synchronous checks via getState())
 * - Legacy compatibility with existing code
 */

// Re-export types and data for backwards compatibility
import type { DemoUser } from '@/lib/demo-users'
import { DEMO_USERS } from '@/lib/demo-users'
import { useAuthStore } from '@/lib/auth-store'

export type { DemoUser } from '@/lib/demo-users'
export { DEMO_USERS } from '@/lib/demo-users'

export const mockAuth = {
  /**
   * Login with a demo user by ID
   * Delegates to useAuthStore for single source of truth
   */
  login: (userId: string): DemoUser | null => {
    return useAuthStore.getState().login(userId)
  },

  /**
   * Logout current user
   * Delegates to useAuthStore for single source of truth
   */
  logout: (): void => {
    useAuthStore.getState().logout()
  },

  /**
   * Get currently logged in user
   * Reads directly from useAuthStore state
   */
  getCurrentUser: (): DemoUser | null => {
    return useAuthStore.getState().user
  },

  /**
   * Check if user is authenticated
   * Reads directly from useAuthStore state
   */
  isAuthenticated: (): boolean => {
    return useAuthStore.getState().isAuthenticated
  },

  /**
   * Get all available demo users
   */
  getAvailableUsers: (): Array<DemoUser> => {
    return DEMO_USERS
  },
}
