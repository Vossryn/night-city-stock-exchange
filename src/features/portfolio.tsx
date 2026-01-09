import { useMemo } from 'react'
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react'

import { getHoldingGainLoss, usePortfolioStore } from '@/lib/portfolio-store'
import { useSimulatedStocks } from '@/hooks/useSimulatedStocks'

export function Portfolio() {
  const holdings = usePortfolioStore((state) => state.holdings)
  const cash = usePortfolioStore((state) => state.cashBalance)
  const getTotalValue = usePortfolioStore(
    (state) => state.getTotalPortfolioValue,
  )
  const simulatedStocks = useSimulatedStocks()

  const holdingsArray = Object.entries(holdings).map(([symbol, holding]) => ({
    symbol,
    ...holding,
  }))

  // Create price map from simulated stocks
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
  const totalInvested = holdingsArray.reduce(
    (sum, holding) => sum + holding.averageCost * holding.quantity,
    0,
  )
  const totalReturn = netWorth - cash - totalInvested
  const totalReturnPercent =
    totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold text-cyan-500">My Portfolio</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border border-gray-700 rounded bg-card">
          <h2 className="text-xl font-semibold mb-2">Net Worth</h2>
          <p className="text-2xl font-mono text-cyan-400">
            ${netWorth.toFixed(2)}
          </p>
          <p className="text-sm text-gray-400 mt-1">Cash: ${cash.toFixed(2)}</p>
        </div>
        <div className="p-4 border border-gray-700 rounded bg-card">
          <h2 className="text-xl font-semibold mb-2">Total Invested</h2>
          <p className="text-2xl font-mono text-white">
            ${totalInvested.toFixed(2)}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {holdingsArray.length} position
            {holdingsArray.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="p-4 border border-gray-700 rounded bg-card">
          <h2 className="text-xl font-semibold mb-2">Total Return</h2>
          <div className="flex items-center gap-2">
            <p
              className={`text-2xl font-mono ${totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}
            >
              ${totalReturn.toFixed(2)}
            </p>
            {totalReturn !== 0 && (
              <span
                className={`flex items-center text-sm font-mono ${totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}
              >
                {totalReturn > 0 ? (
                  <ArrowUpIcon className="w-4 h-4" />
                ) : (
                  <ArrowDownIcon className="w-4 h-4" />
                )}
                {Math.abs(totalReturnPercent).toFixed(2)}%
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="border border-gray-700 rounded overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-3">Symbol</th>
              <th className="p-3">Company</th>
              <th className="p-3 text-right">Quantity</th>
              <th className="p-3 text-right">Avg Cost</th>
              <th className="p-3 text-right">Current Price</th>
              <th className="p-3 text-right">Value</th>
              <th className="p-3 text-right">Return</th>
            </tr>
          </thead>
          <tbody>
            {holdingsArray.length === 0 ? (
              <tr>
                <td className="p-3 text-center text-gray-500" colSpan={7}>
                  No holdings yet. Go trade!
                </td>
              </tr>
            ) : (
              holdingsArray.map((holding) => {
                const currentPrice = currentPrices[holding.symbol] || 0
                const { gainLoss, gainLossPercent, totalValue } =
                  getHoldingGainLoss(holding, currentPrice)

                return (
                  <tr key={holding.symbol} className="border-t border-gray-700">
                    <td className="p-3 font-mono font-bold text-cyan-400">
                      {holding.symbol}
                    </td>
                    <td className="p-3 text-gray-300">{holding.symbol}</td>
                    <td className="p-3 text-right font-mono">
                      {holding.quantity}
                    </td>
                    <td className="p-3 text-right font-mono">
                      ${holding.averageCost.toFixed(2)}
                    </td>
                    <td className="p-3 text-right font-mono">
                      ${currentPrice.toFixed(2)}
                    </td>
                    <td className="p-3 text-right font-mono">
                      ${totalValue.toFixed(2)}
                    </td>
                    <td
                      className={`p-3 text-right font-mono ${gainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}
                    >
                      <div className="flex items-center justify-end gap-1">
                        {gainLoss > 0 ? (
                          <ArrowUpIcon className="w-3 h-3" />
                        ) : gainLoss < 0 ? (
                          <ArrowDownIcon className="w-3 h-3" />
                        ) : null}
                        <span>${gainLoss.toFixed(2)}</span>
                        <span className="text-xs">
                          ({gainLossPercent.toFixed(2)}%)
                        </span>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
