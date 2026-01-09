import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from 'lucide-react'
import { Link } from '@tanstack/react-router'

import { company_data } from '@/lib/company-data'
import { useSimulatedStocks } from '@/hooks/useSimulatedStocks'
import { useMarketStore } from '@/lib/market-store'

export function MarketListing() {
  const simulatedStocks = useSimulatedStocks()
  const isInitialized = useMarketStore((state) => state.isInitialized)

  // Create a map of company name to simulated stock data
  const stockPriceMap = new Map(
    simulatedStocks.map((stock) => [stock.name, stock]),
  )

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Listed Companies</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {company_data.map((company) => {
          const stockData = stockPriceMap.get(company.name)

          return (
            <Link
              key={company.name}
              to="/market/$symbol"
              params={{ symbol: company.name }}
              className="block p-4 border border-gray-700 hover:border-neon-blue transition-colors rounded bg-card"
            >
              <div className="flex items-center gap-3">
                <img
                  src={company.image}
                  alt={company.name}
                  className="w-12 h-12 object-contain"
                />
                <div className="flex-1">
                  <h3 className="font-bold">{company.name}</h3>
                  <p className="text-sm text-gray-400">
                    {company.type.join(', ')}
                  </p>
                </div>
                {isInitialized && stockData && (
                  <div className="text-right">
                    <div className="font-mono text-sm">
                      ${stockData.currentPrice.toFixed(2)}
                    </div>
                    <div
                      className={`flex items-center justify-end text-xs font-mono ${
                        stockData.changePercent > 0
                          ? 'text-green-500'
                          : stockData.changePercent < 0
                            ? 'text-red-500'
                            : 'text-gray-400'
                      }`}
                    >
                      {stockData.changePercent > 0 ? (
                        <ArrowUpIcon className="w-3 h-3 mr-0.5" />
                      ) : stockData.changePercent < 0 ? (
                        <ArrowDownIcon className="w-3 h-3 mr-0.5" />
                      ) : (
                        <MinusIcon className="w-3 h-3 mr-0.5" />
                      )}
                      {Math.abs(stockData.changePercent).toFixed(2)}%
                    </div>
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
