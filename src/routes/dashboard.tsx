import { createFileRoute, redirect } from '@tanstack/react-router'

import { Dashboard } from '@/features/dashboard'
import { getSession } from '@/lib/serverFn'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async ({ location }) => {
    const session = await getSession()

    if (!session) {
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
