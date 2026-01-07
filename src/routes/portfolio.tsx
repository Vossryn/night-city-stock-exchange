import { createFileRoute, redirect } from '@tanstack/react-router'

import { Portfolio } from '@/features/portfolio'
import { useAuthStore } from '@/lib/auth-store'

export const Route = createFileRoute('/portfolio')({
  beforeLoad: ({ location }) => {
    if (!useAuthStore.getState().isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: Portfolio,
})
