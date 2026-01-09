import { createFileRoute, redirect } from '@tanstack/react-router'

import { MarketListing } from '@/features/market-listing'
import { mockAuth } from '@/lib/mock-auth'

export const Route = createFileRoute('/market/')({
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
  component: MarketListing,
})
