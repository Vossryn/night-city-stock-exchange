import { createServerFn } from '@tanstack/react-start'

/**
 * Server function to fetch all companies with their latest stock price.
 */
export const getActiveStocks = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { getActiveStocksFromDb } = await import('@/lib/db-queries.server')
    return getActiveStocksFromDb()
  },
)
