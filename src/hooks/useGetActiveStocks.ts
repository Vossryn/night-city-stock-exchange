import { useQuery } from '@tanstack/react-query'

import { getActiveStocks } from '@/lib/serverFn'

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
    queryFn: async () => {
      const { getMarketHistory } = await import('@/lib/serverFn')
      return getMarketHistory({ data: { days, companyIds } })
    },
    enabled: !!days,
  })
}
