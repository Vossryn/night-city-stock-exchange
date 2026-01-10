import { createFileRoute, redirect } from '@tanstack/react-router'

import { TransactionHistory } from '@/features/transaction-history'
import { mockAuth } from '@/lib/mock-auth'

export const Route = createFileRoute('/transactions')({
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
  component: TransactionHistory,
})
