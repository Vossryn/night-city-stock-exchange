/**
 * Hook to capture portfolio value snapshots for historical tracking
 * Should be called at the app root level alongside useDailySnapshotInit
 */

import { useEffect, useMemo } from 'react'

import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useSimulatedStocks } from '@/hooks/useSimulatedStocks'
import { useMarketStore } from '@/lib/market-store'
import { usePortfolioHistoryStore } from '@/lib/portfolio-history-store'
import { usePortfolioStore } from '@/lib/portfolio-store'

/**
 * Hook to initialize and manage portfolio history snapshots.
 * Captures daily portfolio value when market initializes.
 * Should be called at the app root level.
 */
export function usePortfolioHistoryCapture() {
  const { user } = useCurrentUser()
  const isInitialized = useMarketStore((state) => state.isInitialized)
  const simulatedStocks = useSimulatedStocks()

  const cash = usePortfolioStore((state) => state.cashBalance)
  const getTotalValue = usePortfolioStore(
    (state) => state.getTotalPortfolioValue,
  )

  const loadUserHistory = usePortfolioHistoryStore(
    (state: { loadUserHistory: (userId: string) => void }) =>
      state.loadUserHistory,
  )
  const captureDataPoint = usePortfolioHistoryStore(
    (state: {
      captureDataPoint: (
        portfolioValue: number,
        cashBalance: number,
        holdingsValue: number,
      ) => void
    }) => state.captureDataPoint,
  )
  const hasTodaySnapshot = usePortfolioHistoryStore(
    (state: { hasTodaySnapshot: () => boolean }) => state.hasTodaySnapshot,
  )

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

  // Load user's history when they log in
  useEffect(() => {
    if (user?.id) {
      loadUserHistory(user.id)
    }
  }, [user?.id, loadUserHistory])

  // Capture snapshot when market initializes (if no today snapshot)
  useEffect(() => {
    if (isInitialized && user?.id && !hasTodaySnapshot()) {
      const portfolioValue = getTotalValue(currentPrices)
      const holdingsValue = portfolioValue - cash
      captureDataPoint(portfolioValue, cash, holdingsValue)
    }
  }, [
    isInitialized,
    user?.id,
    hasTodaySnapshot,
    getTotalValue,
    currentPrices,
    cash,
    captureDataPoint,
  ])
}

/**
 * Hook to manually trigger a snapshot capture (e.g., after trade)
 * Returns a function that captures the current portfolio state
 */
export function useCapturePortfolioSnapshot() {
  const simulatedStocks = useSimulatedStocks()
  const cash = usePortfolioStore((state) => state.cashBalance)
  const getTotalValue = usePortfolioStore(
    (state) => state.getTotalPortfolioValue,
  )
  const captureDataPoint = usePortfolioHistoryStore(
    (state: {
      captureDataPoint: (
        portfolioValue: number,
        cashBalance: number,
        holdingsValue: number,
      ) => void
    }) => state.captureDataPoint,
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

  return () => {
    const portfolioValue = getTotalValue(currentPrices)
    const holdingsValue = portfolioValue - cash
    captureDataPoint(portfolioValue, cash, holdingsValue)
  }
}
