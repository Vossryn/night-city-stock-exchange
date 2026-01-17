import { useMemo } from 'react'

import { useSimulatedStocks } from '@/hooks/useSimulatedStocks'
import { usePortfolioStore } from '@/lib/portfolio-store'

export interface AllocationData {
  name: string
  value: number
  percentage: number
}

/**
 * Hook to calculate portfolio allocation by sector.
 * Returns array of sectors with their total value and percentage of portfolio.
 */
export function usePortfolioAllocation(): Array<AllocationData> {
  const holdings = usePortfolioStore((state) => state.holdings)
  const simulatedStocks = useSimulatedStocks()

  return useMemo(() => {
    const sectorTotals: Record<string, number> = {}
    let total = 0

    for (const [symbol, holding] of Object.entries(holdings)) {
      const stock = simulatedStocks.find((s) => s.ticker === symbol)
      if (!stock) continue

      const value = holding.quantity * stock.currentPrice
      total += value

      sectorTotals[stock.sector] = (sectorTotals[stock.sector] || 0) + value
    }

    return Object.entries(sectorTotals)
      .map(([name, value]) => ({
        name,
        value,
        percentage: total > 0 ? (value / total) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value) // Sort by value descending
  }, [holdings, simulatedStocks])
}

/**
 * Hook to calculate portfolio allocation by company.
 * Returns array of companies with their total value and percentage of portfolio.
 */
export function usePortfolioAllocationByCompany(): Array<AllocationData> {
  const holdings = usePortfolioStore((state) => state.holdings)
  const simulatedStocks = useSimulatedStocks()

  return useMemo(() => {
    let total = 0
    const companyValues: Array<{ name: string; value: number }> = []

    for (const [symbol, holding] of Object.entries(holdings)) {
      const stock = simulatedStocks.find((s) => s.ticker === symbol)
      if (!stock) continue

      const value = holding.quantity * stock.currentPrice
      total += value

      companyValues.push({
        name: stock.name,
        value,
      })
    }

    return companyValues
      .map(({ name, value }) => ({
        name,
        value,
        percentage: total > 0 ? (value / total) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value) // Sort by value descending
  }, [holdings, simulatedStocks])
}
