import { createFileRoute, redirect } from '@tanstack/react-router'

import { Login } from '@/features/login'
import { useAuthStore } from '@/lib/auth-store'

export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    if (useAuthStore.getState().isAuthenticated) {
      throw redirect({
        to: '/dashboard',
      })
    }
  },
  component: Login,
})
