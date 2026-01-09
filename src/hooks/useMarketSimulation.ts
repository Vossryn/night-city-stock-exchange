import { useEffect, useRef } from 'react'

import { useGetActiveStocks } from './useGetActiveStocks'
import { MarketStatus, useMarketStore } from '@/lib/market-store'

/**
 * Hook to manage the market price simulation lifecycle.
 * Initializes stocks from database and runs periodic price updates.
 *
 * @param enabled - Whether to run the simulation (default: true)
 */
export function useMarketSimulation(enabled: boolean = true) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const marketStatus = useMarketStore((state) => state.status)
  const tickInterval = useMarketStore((state) => state.tickInterval)
  const isInitialized = useMarketStore((state) => state.isInitialized)
  const initializeStocks = useMarketStore((state) => state.initializeStocks)
  const updatePrices = useMarketStore((state) => state.updatePrices)

  // Fetch initial stock data from database
  const { data: dbStocks, isSuccess } = useGetActiveStocks()

  // Initialize stocks when database data is available
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- dbStocks can be undefined despite isSuccess
    if (!isInitialized && isSuccess && dbStocks) {
      if (dbStocks.length === 0) return

      const stockData = dbStocks.map((stock) => ({
        id: stock.id,
        ticker: stock.ticker,
        name: stock.name,
        sector: stock.sector,
        price: stock.price,
      }))

      initializeStocks(stockData)
    }
  }, [isSuccess, dbStocks, isInitialized, initializeStocks])

  // Set up price update interval
  useEffect(() => {
    if (!enabled || !isInitialized || marketStatus !== MarketStatus.OPEN) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Start new interval
    intervalRef.current = setInterval(() => {
      updatePrices()
    }, tickInterval)

    // Cleanup on unmount or dependency change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [enabled, isInitialized, marketStatus, tickInterval, updatePrices])

  return {
    isInitialized,
    marketStatus,
    tickInterval,
  }
}
