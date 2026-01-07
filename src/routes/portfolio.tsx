import { createFileRoute, redirect } from '@tanstack/react-router'

import { Portfolio } from '@/features/portfolio'
import { getSession } from '@/lib/serverFn'

export const Route = createFileRoute('/portfolio')({
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
  component: Portfolio,
})
