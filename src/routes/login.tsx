import { createFileRoute, redirect } from '@tanstack/react-router'

import { Login } from '@/features/login'
import { getSession } from '@/lib/serverFn'

export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    const session = await getSession()

    if (session) {
      throw redirect({
        to: '/dashboard',
      })
    }
  },
  component: Login,
})
