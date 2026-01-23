import { createServerFn } from '@tanstack/react-start'

import { requireAuth } from './auth-middleware'

import type { AggregationPeriod } from '@/lib/db-queries.server'

/**
 * Server function to fetch OHLC (candlestick) data for a company.
 * Supports aggregation to daily, weekly, or monthly candles.
 * Requires authentication.
 */
export const getOHLCHistory = createServerFn({ method: 'GET' })
  .inputValidator(
    (d: { days: number; companyId: string; period?: AggregationPeriod }) => d,
  )
  .handler(async ({ data }) => {
    await requireAuth()
    const { getAggregatedOHLCFromDb } = await import('@/lib/db-queries.server')
    return getAggregatedOHLCFromDb(data.days, data.companyId, data.period)
  })
