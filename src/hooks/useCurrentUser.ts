import { useNavigate } from '@tanstack/react-router'

import { useAuthStore } from '@/lib/auth-store'
import { useDailySnapshotStore } from '@/lib/daily-snapshot-store'
import { usePortfolioStore } from '@/lib/portfolio-store'

/**
 * Hook to access current authenticated user.
 * Returns null if not authenticated.
 */
export function useCurrentUser() {
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return {
    user,
    isAuthenticated,
    isLoading: false, // Zustand hydrates synchronously from localStorage
  }
}

/**
 * Hook to handle user logout with navigation.
 * Returns the logout function directly.
 */
export function useLogout() {
  const navigate = useNavigate()
  const authLogout = useAuthStore((state) => state.logout)
  const clearPortfolio = usePortfolioStore((state) => state.clearPortfolio)
  const clearSnapshot = useDailySnapshotStore((state) => state.clearSnapshot)

  const logout = () => {
    authLogout()
    clearPortfolio()
    clearSnapshot()
    navigate({ to: '/login' })
  }

  return logout
}
