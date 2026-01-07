import { createServerFn } from '@tanstack/react-start';

/**
 * Server function to fetch historical stock prices.
 */
export const getMarketHistory = createServerFn({ method: 'GET' })
  .inputValidator((d: { days: number; companyIds?: Array<string> }) => d)
  .handler(async ({ data }) => {
    const { getMarketHistoryFromDb } = await import('@/lib/db-queries.server')
    return getMarketHistoryFromDb(data.days, data.companyIds)
  })
