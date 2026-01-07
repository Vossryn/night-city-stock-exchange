import { createFileRoute, redirect } from '@tanstack/react-router'

import { MarketListing } from '@/features/market-listing'
import { useAuthStore } from '@/lib/auth-store'

export const Route = createFileRoute('/market')({
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
  component: MarketListing,
})
