import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import type { DemoUser } from '@/lib/mock-auth'
import { mockAuth } from '@/lib/mock-auth'


/**
 * Hook to access current authenticated user.
 * Returns null if not authenticated.
 */
export function useCurrentUser() {
  const [user, setUser] = useState<DemoUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get current user from localStorage
    const currentUser = mockAuth.getCurrentUser()
    setUser(currentUser)
    setIsLoading(false)

    // Listen for storage changes (logout from another tab)
    const handleStorageChange = () => {
      const updatedUser = mockAuth.getCurrentUser()
      setUser(updatedUser)
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
  }
}

/**
 * Hook to handle user logout with navigation.
 */
export function useLogout() {
  const navigate = useNavigate()

  const logout = () => {
    mockAuth.logout()
    navigate({ to: '/login' })
  }

  return { logout }
}
