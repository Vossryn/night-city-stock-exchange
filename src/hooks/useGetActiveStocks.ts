import { useQuery } from '@tanstack/react-query'
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

/**
 * Server function to fetch historical stock prices.
 */
export const getMarketHistory = createServerFn({ method: 'GET' })
  .inputValidator((d: { days: number; companyIds?: Array<string> }) => d)
  .handler(async ({ data }) => {
    const { getMarketHistoryFromDb } = await import('@/lib/db-queries.server')
    return getMarketHistoryFromDb(data.days, data.companyIds)
  })

/**
 * Hook to fetch active stocks using React Query and the server function.
 */
export function useGetActiveStocks() {
  return useQuery({
    queryKey: ['activeStocks'],
    queryFn: () => getActiveStocks(),
  })
}

/**
 * Hook to fetch market history using React Query and the server function.
 */
export function useGetMarketHistory(days: number, companyIds?: Array<string>) {
  return useQuery({
    queryKey: ['marketHistory', days, companyIds],
    queryFn: () => getMarketHistory({ data: { days, companyIds } }),
    enabled: !!days,
  })
}
