import { useMemo } from 'react'

import type { SimulatedStock } from '@/lib/market-store'

import { useMarketStore } from '@/lib/market-store'

/**
 * Hook to access all simulated stocks.
 * Returns reactive data that updates when prices change.
 */
export function useSimulatedStocks(): Array<SimulatedStock> {
  const getAllStocks = useMarketStore((state) => state.getAllStocks)
  const lastTickTime = useMarketStore((state) => state.lastTickTime)

  // Only recompute when prices actually change (lastTickTime updates)
  return useMemo(() => getAllStocks(), [getAllStocks, lastTickTime])
}

/**
 * Hook to access a specific simulated stock by ticker.
 *
 * @param ticker - Stock ticker symbol
 */
export function useSimulatedStock(ticker: string): SimulatedStock | undefined {
  const getStockByTicker = useMarketStore((state) => state.getStockByTicker)
  return useMemo(() => getStockByTicker(ticker), [getStockByTicker, ticker])
}

/**
 * Hook to access a specific simulated stock by ID.
 *
 * @param id - Stock ID
 */
export function useSimulatedStockById(id: string): SimulatedStock | undefined {
  const getStockById = useMarketStore((state) => state.getStockById)
  return useMemo(() => getStockById(id), [getStockById, id])
}

/**
 * Hook to get current market statistics.
 */
export function useMarketStats() {
  const stocks = useSimulatedStocks()

  return useMemo(() => {
    if (stocks.length === 0) {
      return {
        totalStocks: 0,
        gainers: 0,
        losers: 0,
        unchanged: 0,
        averageChange: 0,
      }
    }

    let gainers = 0
    let losers = 0
    let unchanged = 0
    let totalChange = 0

    for (const stock of stocks) {
      if (stock.changePercent > 0) {
        gainers++
      } else if (stock.changePercent < 0) {
        losers++
      } else {
        unchanged++
      }
      totalChange += stock.changePercent
    }

    return {
      totalStocks: stocks.length,
      gainers,
      losers,
      unchanged,
      averageChange: totalChange / stocks.length,
    }
  }, [stocks])
}
