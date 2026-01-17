/**
 * Auth State Management with Zustand
 * Manages current authenticated user with localStorage persistence
 * Uses the same storage key as mock-auth for compatibility
 */

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { DemoUser } from '@/lib/demo-users'
import { DEMO_USERS } from '@/lib/demo-users'

const STORAGE_KEY = 'ncse-demo-user'

interface AuthState {
  user: DemoUser | null
  isAuthenticated: boolean
  login: (userId: string) => DemoUser | null
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (userId: string) => {
        const user = DEMO_USERS.find((u) => u.id === userId)
        if (user) {
          set({ user, isAuthenticated: true })
          return user
        }
        return null
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      // Only persist the user, derive isAuthenticated
      partialize: (state) => ({ user: state.user }),
      merge: (persisted, current) => {
        const persistedState = persisted as Partial<AuthState>
        return {
          ...current,
          ...persistedState,
          isAuthenticated: !!persistedState.user,
        }
      },
    },
  ),
)
