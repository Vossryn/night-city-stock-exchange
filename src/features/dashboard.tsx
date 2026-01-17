import { useMemo } from 'react'
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from 'lucide-react'

import { ActiveStocksChart } from '@/components/active-stocks-chart'
import { MarketControls } from '@/components/market-controls'
import { MarketEvents } from '@/components/market-events'
import { useDailyPL } from '@/hooks/useDailySnapshot'
import { useGetTopMover } from '@/hooks/useGetTopMover'
import { useMarketStats, useSimulatedStocks } from '@/hooks/useSimulatedStocks'
import { MarketStatus, useMarketStore } from '@/lib/market-store'
import { usePortfolioStore } from '@/lib/portfolio-store'

export function Dashboard() {
  const { data: topMover, isLoading: isLoadingTopMover } = useGetTopMover()

  // Get market simulation state
  const marketStatus = useMarketStore((state) => state.status)
  const isInitialized = useMarketStore((state) => state.isInitialized)
  const simulatedStocks = useSimulatedStocks()
  const marketStats = useMarketStats()

  // Get portfolio data
  const cash = usePortfolioStore((state) => state.cashBalance)
  const getTotalValue = usePortfolioStore(
    (state) => state.getTotalPortfolioValue,
  )

  // Get daily P/L
  const dailyPL = useDailyPL()

  // Calculate top mover from simulated data
  const simulatedTopMover = useMemo(() => {
    if (simulatedStocks.length === 0) return null

    let currentTopMover = simulatedStocks[0]
    for (const stock of simulatedStocks) {
      if (
        Math.abs(stock.changePercent) > Math.abs(currentTopMover.changePercent)
      ) {
        currentTopMover = stock
      }
    }
    return currentTopMover
  }, [simulatedStocks])

  // Use simulated top mover if available, otherwise fall back to DB data
  const displayMover =
    isInitialized && simulatedTopMover ? simulatedTopMover : topMover

  // Calculate net worth from simulated prices
  const currentPrices = useMemo(() => {
    return simulatedStocks.reduce(
      (acc, stock) => {
        acc[stock.ticker] = stock.currentPrice
        return acc
      },
      {} as Record<string, number>,
    )
  }, [simulatedStocks])

  const netWorth = getTotalValue(currentPrices)

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-3xl font-bold text-cyan-500">Dashboard</h1>
      <MarketControls />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border border-cyan-800/50 rounded bg-black/50">
          <h2 className="text-xl font-semibold mb-2">Account Snapshot</h2>
          <p>
            Net Worth:{' '}
            <span className="font-mono text-cyan-400">
              ${netWorth.toFixed(2)}
            </span>
          </p>
          <p>
            Buying Power:{' '}
            <span className="font-mono text-cyan-400">${cash.toFixed(2)}</span>
          </p>
          <p>
            Daily P/L:{' '}
            <span
              className={`font-mono ${dailyPL.value >= 0 ? 'text-green-500' : 'text-red-500'}`}
            >
              {dailyPL.value >= 0 ? '+' : ''}${dailyPL.value.toFixed(2)} (
              {dailyPL.percent >= 0 ? '+' : ''}
              {dailyPL.percent.toFixed(2)}%)
            </span>
          </p>
        </div>
        <div className="p-4 border border-cyan-800/50 rounded bg-black/50">
          <h2 className="text-xl font-semibold mb-2">Market Status</h2>
          <p>
            Status:{' '}
            <span
              className={`font-mono ${marketStatus === MarketStatus.OPEN ? 'text-green-500' : 'text-red-500'}`}
            >
              {marketStatus}
            </span>
          </p>
          {isInitialized && (
            <div className="mt-2 text-sm text-gray-400">
              <div className="flex justify-between">
                <span>Gainers:</span>
                <span className="text-green-500">{marketStats.gainers}</span>
              </div>
              <div className="flex justify-between">
                <span>Losers:</span>
                <span className="text-red-500">{marketStats.losers}</span>
              </div>
            </div>
          )}
        </div>
        <div className="p-4 border border-cyan-800/50 rounded bg-black/50">
          <h2 className="text-xl font-semibold mb-2">Top Mover</h2>
          {!isInitialized && isLoadingTopMover ? (
            <div className="animate-pulse h-12 bg-cyan-900/20 rounded"></div>
          ) : displayMover ? (
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-lg">{displayMover.ticker}</div>
                <div className="text-xs text-gray-400">{displayMover.name}</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-lg">
                  ${displayMover.currentPrice.toFixed(2)}
                </div>
                <div
                  className={`flex items-center justify-end text-sm font-mono ${displayMover.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}
                >
                  {displayMover.changePercent > 0 ? (
                    <ArrowUpIcon className="w-3 h-3 mr-1" />
                  ) : displayMover.changePercent < 0 ? (
                    <ArrowDownIcon className="w-3 h-3 mr-1" />
                  ) : (
                    <MinusIcon className="w-3 h-3 mr-1" />
                  )}
                  {Math.abs(displayMover.changePercent).toFixed(2)}%
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 italic">No market data available</p>
          )}
        </div>
      </div>
      <MarketEvents />
      <ActiveStocksChart />
    </div>
  )
}
