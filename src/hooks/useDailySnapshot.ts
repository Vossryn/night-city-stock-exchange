import { useEffect, useMemo } from 'react'

import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useSimulatedStocks } from '@/hooks/useSimulatedStocks'
import { useDailySnapshotStore } from '@/lib/daily-snapshot-store'
import { useMarketStore } from '@/lib/market-store'
import { usePortfolioStore } from '@/lib/portfolio-store'

/**
 * Hook to initialize and manage daily snapshots.
 * Captures "start of day" prices when market initializes.
 * Should be called at the app root level.
 */
export function useDailySnapshotInit() {
  const { user } = useCurrentUser()
  const isInitialized = useMarketStore((state) => state.isInitialized)
  const simulatedStocks = useSimulatedStocks()
  const getTotalValue = usePortfolioStore(
    (state) => state.getTotalPortfolioValue,
  )

  const loadUserSnapshot = useDailySnapshotStore(
    (state) => state.loadUserSnapshot,
  )
  const captureSnapshot = useDailySnapshotStore(
    (state) => state.captureSnapshot,
  )
  const hasSnapshot = useDailySnapshotStore((state) => state.hasSnapshot)

  // Load user's snapshot when they log in
  useEffect(() => {
    if (user?.id) {
      loadUserSnapshot(user.id)
    }
  }, [user?.id, loadUserSnapshot])

  // Build current prices map from simulated stocks
  const currentPrices = useMemo(() => {
    return simulatedStocks.reduce(
      (acc, stock) => {
        acc[stock.ticker] = stock.currentPrice
        return acc
      },
      {} as Record<string, number>,
    )
  }, [simulatedStocks])

  // Capture snapshot when market initializes and no snapshot exists
  useEffect(() => {
    if (isInitialized && user?.id && !hasSnapshot()) {
      const portfolioValue = getTotalValue(currentPrices)
      captureSnapshot(portfolioValue, currentPrices)
    }
  }, [
    isInitialized,
    user?.id,
    hasSnapshot,
    getTotalValue,
    currentPrices,
    captureSnapshot,
  ])
}

/**
 * Hook to access daily P/L calculations.
 * Returns the current daily P/L based on portfolio value.
 */
export function useDailyPL() {
  const getDailyPL = useDailySnapshotStore((state) => state.getDailyPL)
  const simulatedStocks = useSimulatedStocks()
  const getTotalValue = usePortfolioStore(
    (state) => state.getTotalPortfolioValue,
  )

  const currentPrices = useMemo(() => {
    return simulatedStocks.reduce(
      (acc, stock) => {
        acc[stock.ticker] = stock.currentPrice
        return acc
      },
      {} as Record<string, number>,
    )
  }, [simulatedStocks])

  const currentValue = getTotalValue(currentPrices)

  return useMemo(() => getDailyPL(currentValue), [getDailyPL, currentValue])
}

/**
 * Hook to get stock price at day start.
 */
export function useStockPriceAtDayStart(ticker: string): number | undefined {
  const getStockPriceAtStart = useDailySnapshotStore(
    (state) => state.getStockPriceAtStart,
  )
  return useMemo(
    () => getStockPriceAtStart(ticker),
    [getStockPriceAtStart, ticker],
  )
}
