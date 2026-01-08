import { createFileRoute, redirect } from '@tanstack/react-router'

import { Dashboard } from '@/features/dashboard'
import { mockAuth } from '@/lib/mock-auth'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: ({ location }) => {
    if (!mockAuth.isAuthenticated()) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: Dashboard,
})
