import { createServerFn } from '@tanstack/react-start'

import { requireAuth } from './auth-middleware'

/**
 * Server function to fetch all companies with their latest stock price.
 * Requires authentication.
 */
export const getActiveStocks = createServerFn({ method: 'GET' }).handler(
  async () => {
    await requireAuth()
    const { getActiveStocksFromDb } = await import('@/lib/db-queries.server')
    return getActiveStocksFromDb()
  },
)
