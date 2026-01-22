import { useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { Button } from '@/components/ui/button'
import { usePortfolioHistoryStore } from '@/lib/portfolio-history-store'

type Timeframe = '7D' | '14D' | '30D'

const TIMEFRAME_DAYS: Record<Timeframe, number> = {
  '7D': 7,
  '14D': 14,
  '30D': 30,
}

export function PortfolioValueChart() {
  const [timeframe, setTimeframe] = useState<Timeframe>('7D')
  const getHistoryForChart = usePortfolioHistoryStore(
    (state: {
      getHistoryForChart: (days?: number) => Array<{
        date: string
        value: number
        cash: number
        holdings: number
      }>
    }) => state.getHistoryForChart,
  )

  const chartData = getHistoryForChart(TIMEFRAME_DAYS[timeframe])

  if (chartData.length === 0) {
    return (
      <div className="p-6 border border-gray-700 rounded bg-card">
        <h2 className="text-xl font-semibold mb-4">Portfolio Value History</h2>
        <div className="flex items-center justify-center h-64 text-gray-500 font-mono">
          NO HISTORY DATA YET - CHECK BACK TOMORROW
        </div>
        <p className="text-center text-gray-600 text-sm mt-2">
          Portfolio snapshots are captured daily
        </p>
      </div>
    )
  }

  // Calculate min/max for Y axis with padding
  const values = chartData.map((d: { value: number }) => d.value)
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)
  const padding = (maxValue - minValue) * 0.1 || maxValue * 0.05
  const yMin = Math.max(0, minValue - padding)
  const yMax = maxValue + padding

  // Determine if overall trend is positive
  const isPositive =
    chartData.length > 1
      ? chartData[chartData.length - 1].value >= chartData[0].value
      : true

  return (
    <div className="p-6 border border-gray-700 rounded bg-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Portfolio Value History</h2>
        <div className="flex items-center gap-2">
          {(['7D', '14D', '30D'] as Array<Timeframe>).map((tf) => (
            <Button
              key={tf}
              variant={timeframe === tf ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeframe(tf)}
              className={
                timeframe === tf
                  ? 'bg-cyan-600 hover:bg-cyan-700'
                  : 'border-cyan-800/50 text-cyan-500 hover:text-neon-blue hover:border-neon-blue'
              }
            >
              {tf}
            </Button>
          ))}
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={40}
              tick={{ fill: '#888', fontSize: 12 }}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#888', fontSize: 12 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              domain={[yMin, yMax]}
              width={60}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                border: '1px solid rgba(0, 255, 255, 0.3)',
                borderRadius: '4px',
              }}
              labelStyle={{ color: '#00ffff' }}
              formatter={(value: number) => [
                `$${value.toFixed(2)}`,
                'Portfolio Value',
              ]}
              labelFormatter={(label) => {
                const date = new Date(label)
                // Use current year for display (year-agnostic)
                const displayDate = new Date(
                  new Date().getFullYear(),
                  date.getMonth(),
                  date.getDate(),
                )
                return displayDate.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={isPositive ? '#00ff88' : '#ff4444'}
              strokeWidth={2}
              dot={chartData.length <= 14}
              activeDot={{ r: 6, fill: '#00ffff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {chartData.length > 1 && (
        <div className="mt-4 flex justify-between text-sm">
          <div className="text-gray-400">
            Start:{' '}
            <span className="font-mono text-white">
              ${chartData[0].value.toFixed(2)}
            </span>
          </div>
          <div className="text-gray-400">
            Current:{' '}
            <span
              className={`font-mono ${isPositive ? 'text-green-500' : 'text-red-500'}`}
            >
              ${chartData[chartData.length - 1].value.toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
