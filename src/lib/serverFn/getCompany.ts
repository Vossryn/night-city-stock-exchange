import { createServerFn } from '@tanstack/react-start'

import { requireAuth } from './auth-middleware'

/**
 * Server function to fetch a company by ticker.
 * Requires authentication.
 */
export const getCompany = createServerFn({ method: 'GET' })
  .inputValidator((ticker: string) => ticker)
  .handler(async ({ data: ticker }) => {
    await requireAuth()
    const { getCompanyByTicker } = await import('@/lib/db-queries.server')
    return getCompanyByTicker(ticker)
  })
