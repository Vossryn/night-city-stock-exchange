import { createFileRoute, redirect } from '@tanstack/react-router'

import { MarketListing } from '@/features/market-listing'
import { getSession } from '@/lib/serverFn'

export const Route = createFileRoute('/market')({
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
  component: MarketListing,
})
