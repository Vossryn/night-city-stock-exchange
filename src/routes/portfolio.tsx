import { createFileRoute, redirect } from '@tanstack/react-router'

import { Portfolio } from '@/features/portfolio'
import { mockAuth } from '@/lib/mock-auth'

export const Route = createFileRoute('/portfolio')({
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
  component: Portfolio,
})
