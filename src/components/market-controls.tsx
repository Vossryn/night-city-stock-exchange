import { PauseIcon, PlayIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { MarketStatus, useMarketStore } from '@/lib/market-store'

/**
 * Market control component for toggling market status.
 * Allows users to pause/resume the price simulation.
 */
export function MarketControls() {
  const marketStatus = useMarketStore((state) => state.status)
  const setMarketStatus = useMarketStore((state) => state.setMarketStatus)
  const lastTickTime = useMarketStore((state) => state.lastTickTime)
  const isInitialized = useMarketStore((state) => state.isInitialized)

  const isOpen = marketStatus === MarketStatus.OPEN

  const handleToggle = () => {
    setMarketStatus(isOpen ? MarketStatus.CLOSED : MarketStatus.OPEN)
  }

  if (!isInitialized) {
    return null
  }

  return (
    <div className="flex items-center gap-3 p-3 border border-cyan-800/50 rounded bg-black/50">
      <div className="flex-1">
        <div className="text-sm text-gray-400">Market Simulation</div>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}
          />
          <span
            className={`font-mono text-sm ${isOpen ? 'text-green-500' : 'text-red-500'}`}
          >
            {marketStatus}
          </span>
        </div>
        {lastTickTime && (
          <div className="text-xs text-gray-500 mt-1">
            Last update: {lastTickTime.toLocaleTimeString()}
          </div>
        )}
      </div>
      <Button
        onClick={handleToggle}
        variant={isOpen ? 'outline' : 'default'}
        size="sm"
        className={
          isOpen
            ? 'border-red-500 text-red-500 hover:bg-red-950 hover:text-red-400'
            : 'bg-green-600 hover:bg-green-700 text-white'
        }
      >
        {isOpen ? (
          <>
            <PauseIcon className="w-4 h-4 mr-1" />
            Pause
          </>
        ) : (
          <>
            <PlayIcon className="w-4 h-4 mr-1" />
            Resume
          </>
        )}
      </Button>
    </div>
  )
}
