import { useMemo } from 'react'

import { useGetActiveStocks } from './useGetActiveStocks'

import type { Position } from '@/lib/portfolio-store'
import { usePortfolioStore } from '@/lib/portfolio-store'

export interface PositionWithMarketData extends Position {
  currentPrice: number
  currentValue: number
  totalReturn: number
  totalReturnPercent: number
  dayReturn: number
  dayReturnPercent: number
}

export interface PortfolioSummary {
  cash: number
  positions: Array<PositionWithMarketData>
  totalPortfolioValue: number
  totalInvested: number
  totalReturn: number
  totalReturnPercent: number
  dayReturn: number
  dayReturnPercent: number
}

/**
 * Custom hook that combines portfolio store data with current market prices.
 * Returns enriched portfolio information with real-time valuations.
 */
export function usePortfolio(): {
  portfolio: PortfolioSummary | null
  isLoading: boolean
  error: Error | null
} {
  const { data: activeStocks, isLoading, error } = useGetActiveStocks()
  const cash = usePortfolioStore((state) => state.getCash())
  const positions = usePortfolioStore((state) => state.getPositions())
  const currentUserId = usePortfolioStore((state) => state.currentUserId)

  const portfolio = useMemo(() => {
    if (!activeStocks || !currentUserId) return null

    // Build a map of ticker -> current price
    const priceMap = new Map<string, number>()
    for (const stock of activeStocks) {
      if (stock.price !== null) {
        priceMap.set(stock.ticker, stock.price)
      }
    }

    // Calculate enriched positions
    const enrichedPositions: Array<PositionWithMarketData> = []
    let totalInvested = 0
    let totalCurrentValue = 0

    for (const position of Object.values(positions)) {
      const currentPrice = priceMap.get(position.ticker) || 0
      const currentValue = position.quantity * currentPrice
      const invested = position.quantity * position.averageCost
      const totalReturn = currentValue - invested
      const totalReturnPercent =
        invested > 0 ? (totalReturn / invested) * 100 : 0

      // Day return - placeholder for now (would need yesterday's prices)
      const dayReturn = 0
      const dayReturnPercent = 0

      enrichedPositions.push({
        ...position,
        currentPrice,
        currentValue,
        totalReturn,
        totalReturnPercent,
        dayReturn,
        dayReturnPercent,
      })

      totalInvested += invested
      totalCurrentValue += currentValue
    }

    const totalPortfolioValue = cash + totalCurrentValue
    const totalReturn = totalCurrentValue - totalInvested
    const totalReturnPercent =
      totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0

    // Placeholder for day return
    const dayReturn = 0
    const dayReturnPercent = 0

    return {
      cash,
      positions: enrichedPositions,
      totalPortfolioValue,
      totalInvested,
      totalReturn,
      totalReturnPercent,
      dayReturn,
      dayReturnPercent,
    }
  }, [activeStocks, cash, positions, currentUserId])

  return {
    portfolio,
    isLoading,
    error: error,
  }
}
