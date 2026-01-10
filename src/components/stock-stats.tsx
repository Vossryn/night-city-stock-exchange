import { useQuery } from '@tanstack/react-query'
import { ArrowDownIcon, ArrowUpIcon, TrendingUpIcon } from 'lucide-react'

import type { SimulatedStock } from '@/lib/market-store'
import { getStockStats } from '@/lib/serverFn'

interface StockStatsProps {
  companyId: string
  simulatedStock: SimulatedStock | undefined
  currentPrice: number
}

// Simulated shares outstanding based on company size (in millions)
// In a real app, this would come from the database
const SHARES_OUTSTANDING: Record<string, number> = {
  // Mega corps (1-5 billion shares)
  Arasaka: 3500000000,
  Militech: 2800000000,
  Biotechnica: 1500000000,
  Petrochem: 1200000000,
  Zetatech: 900000000,
  // Large corps (100M - 1B shares)
  'Kang Tao': 800000000,
  'Trauma Team': 600000000,
  'Orbital Air': 550000000,
  Kiroshi: 450000000,
  Dynalar: 400000000,
  // Medium corps (50M - 100M shares)
  'All Foods': 95000000,
  Rayfield: 85000000,
  Villefort: 75000000,
  Thorton: 70000000,
  Archer: 65000000,
  // Smaller corps (10M - 50M shares)
  'Delamain Corporation': 45000000,
  Makigai: 40000000,
  Brennan: 35000000,
  Chevillon: 30000000,
  Yaiba: 28000000,
}

// Default shares for companies not in the map
const DEFAULT_SHARES = 50000000

function formatLargeNumber(num: number): string {
  if (num >= 1e12) {
    return `$${(num / 1e12).toFixed(2)}T`
  }
  if (num >= 1e9) {
    return `$${(num / 1e9).toFixed(2)}B`
  }
  if (num >= 1e6) {
    return `$${(num / 1e6).toFixed(2)}M`
  }
  return `$${num.toLocaleString()}`
}

function formatVolume(num: number): string {
  // Simulate daily volume based on price points (multiply by random factor)
  const simulatedVolume = num * 125000
  if (simulatedVolume >= 1e6) {
    return `${(simulatedVolume / 1e6).toFixed(2)}M`
  }
  if (simulatedVolume >= 1e3) {
    return `${(simulatedVolume / 1e3).toFixed(0)}K`
  }
  return simulatedVolume.toLocaleString()
}

export function StockStats({
  companyId,
  simulatedStock,
  currentPrice,
}: StockStatsProps) {
  const { data: stats52Week, isLoading } = useQuery({
    queryKey: ['stockStats', companyId],
    queryFn: () => getStockStats(companyId),
    staleTime: 60000, // Cache for 1 minute
  })

  const companyName = simulatedStock?.name || ''
  const sharesOutstanding = SHARES_OUTSTANDING[companyName] || DEFAULT_SHARES
  const marketCap = currentPrice * sharesOutstanding

  // Day stats from simulated stock
  const dayOpen = simulatedStock?.dayOpen || currentPrice
  const dayHigh = simulatedStock?.dayHigh || currentPrice
  const dayLow = simulatedStock?.dayLow || currentPrice

  // 52-week stats from database
  const week52High = stats52Week?.high || currentPrice
  const week52Low = stats52Week?.low || currentPrice
  const avgVolume = stats52Week?.avgVolume || 0

  // Calculate how close current price is to 52-week high/low
  const priceRange52Week = week52High - week52Low
  const positionIn52Week =
    priceRange52Week > 0
      ? ((currentPrice - week52Low) / priceRange52Week) * 100
      : 50

  return (
    <div className="p-4 border border-gray-700 rounded bg-card">
      <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
        <TrendingUpIcon className="w-4 h-4" />
        Key Statistics
      </h3>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-800 rounded" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 text-sm">
          {/* Market Cap */}
          <div className="p-2 bg-black/30 rounded border border-gray-800">
            <div className="text-gray-500 text-xs">Market Cap</div>
            <div className="font-mono text-cyan-400 font-semibold">
              {formatLargeNumber(marketCap)}
            </div>
          </div>

          {/* Volume */}
          <div className="p-2 bg-black/30 rounded border border-gray-800">
            <div className="text-gray-500 text-xs">Avg Volume</div>
            <div className="font-mono text-white">
              {formatVolume(avgVolume)}
            </div>
          </div>

          {/* Day Range */}
          <div className="p-2 bg-black/30 rounded border border-gray-800">
            <div className="text-gray-500 text-xs">Day Range</div>
            <div className="font-mono text-white text-xs">
              <span className="text-red-400">${dayLow.toFixed(2)}</span>
              <span className="text-gray-600 mx-1">-</span>
              <span className="text-green-400">${dayHigh.toFixed(2)}</span>
            </div>
          </div>

          {/* Day Open */}
          <div className="p-2 bg-black/30 rounded border border-gray-800">
            <div className="text-gray-500 text-xs">Open</div>
            <div className="font-mono text-white flex items-center gap-1">
              ${dayOpen.toFixed(2)}
              {currentPrice > dayOpen ? (
                <ArrowUpIcon className="w-3 h-3 text-green-500" />
              ) : currentPrice < dayOpen ? (
                <ArrowDownIcon className="w-3 h-3 text-red-500" />
              ) : null}
            </div>
          </div>

          {/* 52-Week Range */}
          <div className="col-span-2 p-2 bg-black/30 rounded border border-gray-800">
            <div className="text-gray-500 text-xs mb-1">52-Week Range</div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-red-400 text-xs">
                ${week52Low.toFixed(2)}
              </span>
              <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full relative"
                  style={{ width: '100%' }}
                >
                  <div
                    className="absolute top-0 h-full w-1 bg-white shadow-[0_0_4px_white]"
                    style={{
                      left: `${Math.min(100, Math.max(0, positionIn52Week))}%`,
                    }}
                  />
                </div>
              </div>
              <span className="font-mono text-green-400 text-xs">
                ${week52High.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
