import { useQuery } from '@tanstack/react-query'

import type { AggregationPeriod } from '@/lib/db-queries.server'

/**
 * Hook to fetch OHLC (candlestick) data using React Query and the server function.
 * @param days - Number of days of history to fetch
 * @param companyId - The company ID to fetch data for
 * @param period - Aggregation period: 'daily', 'weekly', or 'monthly'
 */
export function useOHLCHistory(
  days: number,
  companyId: string,
  period: AggregationPeriod = 'daily',
) {
  return useQuery({
    queryKey: ['ohlcHistory', days, companyId, period],
    queryFn: async () => {
      const { getOHLCHistory } = await import('@/lib/serverFn')
      return getOHLCHistory({ data: { days, companyId, period } })
    },
    enabled: !!days && !!companyId,
  })
}
