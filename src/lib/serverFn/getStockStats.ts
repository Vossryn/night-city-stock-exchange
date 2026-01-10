import { createServerFn } from '@tanstack/react-start'

import { requireAuth } from './auth-middleware'

/**
 * Server function to fetch 52-week stats for a company.
 * Returns high, low, and volume data.
 * Requires authentication.
 */
export const getStockStats = createServerFn({ method: 'GET' })
  .inputValidator((companyId: string) => companyId)
  .handler(async ({ data: companyId }) => {
    await requireAuth()
    const { get52WeekStatsFromDb } = await import('@/lib/db-queries.server')
    return get52WeekStatsFromDb(companyId)
  })
