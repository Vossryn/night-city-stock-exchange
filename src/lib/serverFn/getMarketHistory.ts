import { createServerFn } from '@tanstack/react-start'

import { requireAuth } from './auth-middleware'

/**
 * Server function to fetch historical stock prices.
 * Requires authentication.
 */
export const getMarketHistory = createServerFn({ method: 'GET' })
  .inputValidator((d: { days: number; companyIds?: Array<string> }) => d)
  .handler(async ({ data }) => {
    await requireAuth()
    const { getMarketHistoryFromDb } = await import('@/lib/db-queries.server')
    return getMarketHistoryFromDb(data.days, data.companyIds)
  })
