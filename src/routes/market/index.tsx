import { createFileRoute } from '@tanstack/react-router'

import { MarketListing } from '@/features/market-listing'

export const Route = createFileRoute('/market/')({
  component: MarketListing,
})
