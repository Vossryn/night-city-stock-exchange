import { createFileRoute, redirect } from '@tanstack/react-router'

import { Login } from '@/features/login'
import { mockAuth } from '@/lib/mock-auth'

export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    if (mockAuth.isAuthenticated()) {
      throw redirect({
        to: '/dashboard',
      })
    }
  },
  component: Login,
})
