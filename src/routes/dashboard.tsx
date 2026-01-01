import { ActiveStocksChart } from '@/components/active-stocks-chart'
import { useGetTopMover } from '@/hooks/useGetTopMover'
import { useAuthStore } from '@/lib/auth-store'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from 'lucide-react'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: ({ location }) => {
    if (!useAuthStore.getState().isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: Dashboard,
})

function Dashboard() {
  const { data: topMover, isLoading: isLoadingTopMover } = useGetTopMover()

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-3xl font-bold text-cyan-500">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border border-cyan-800/50 rounded bg-black/50">
          <h2 className="text-xl font-semibold mb-2">Account Snapshot</h2>
          <p>Net Worth: $0.00</p>
          <p>Buying Power: $0.00</p>
        </div>
        <div className="p-4 border border-cyan-800/50 rounded bg-black/50">
          <h2 className="text-xl font-semibold mb-2">Market Status</h2>
          <p>
            Status: <span className="text-green-500 font-mono">OPEN</span>
          </p>
        </div>
        <div className="p-4 border border-cyan-800/50 rounded bg-black/50">
          <h2 className="text-xl font-semibold mb-2">Top Mover</h2>
          {isLoadingTopMover ? (
            <div className="animate-pulse h-12 bg-cyan-900/20 rounded"></div>
          ) : topMover ? (
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-lg">{topMover.ticker}</div>
                <div className="text-xs text-gray-400">{topMover.name}</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-lg">
                  ${topMover.currentPrice.toFixed(2)}
                </div>
                <div
                  className={`flex items-center justify-end text-sm font-mono ${topMover.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}
                >
                  {topMover.changePercent > 0 ? (
                    <ArrowUpIcon className="w-3 h-3 mr-1" />
                  ) : topMover.changePercent < 0 ? (
                    <ArrowDownIcon className="w-3 h-3 mr-1" />
                  ) : (
                    <MinusIcon className="w-3 h-3 mr-1" />
                  )}
                  {Math.abs(topMover.changePercent).toFixed(2)}%
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 italic">No market data available</p>
          )}
        </div>
      </div>
      <ActiveStocksChart />
    </div>
  )
}
