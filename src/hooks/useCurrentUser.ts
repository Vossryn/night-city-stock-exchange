import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import { getCurrentAuthUser, signOut } from '@/lib/serverFn'

/**
 * Hook to access current authenticated user with real-time updates.
 * Returns null if not authenticated.
 */
export function useCurrentUser() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => getCurrentAuthUser(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  })

  return {
    user: user || null,
    isAuthenticated: !!user,
    isLoading,
  }
}

/**
 * Hook to handle user logout with navigation.
 */
export function useLogout() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const logout = async () => {
    await signOut()
    queryClient.clear() // Clear all cached data
    navigate({ to: '/login' })
  }

  return logout
}
