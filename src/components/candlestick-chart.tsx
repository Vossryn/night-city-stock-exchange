import { useMemo } from 'react'
import {
  CartesianGrid,
  ComposedChart,
  Customized,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type { OHLCDataPoint } from '@/lib/db-queries.server'

interface CandlestickChartProps {
  data: Array<OHLCDataPoint>
  companyName: string
}

// Cyberpunk color scheme
const BULLISH_COLOR = '#00ff88' // Neon green
const BEARISH_COLOR = '#ff4444' // Red

// Custom tooltip for candlestick chart
interface TooltipPayloadItem {
  payload: OHLCDataPoint
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<TooltipPayloadItem>
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null

  const data = payload[0].payload
  const isBullish = data.close >= data.open
  const changePercent = ((data.close - data.open) / data.open) * 100

  return (
    <div className="bg-black/90 border border-cyan-800/50 rounded p-3 shadow-lg backdrop-blur-sm">
      <div className="text-cyan-400 text-sm font-semibold mb-2">
        {new Date(data.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-mono">
        <span className="text-gray-400">Open:</span>
        <span className="text-white">${data.open.toFixed(2)}</span>
        <span className="text-gray-400">High:</span>
        <span className="text-white">${data.high.toFixed(2)}</span>
        <span className="text-gray-400">Low:</span>
        <span className="text-white">${data.low.toFixed(2)}</span>
        <span className="text-gray-400">Close:</span>
        <span className="text-white">${data.close.toFixed(2)}</span>
      </div>
      <div
        className={`mt-2 text-xs font-mono ${isBullish ? 'text-green-400' : 'text-red-400'}`}
      >
        {isBullish ? '▲' : '▼'} {Math.abs(changePercent).toFixed(2)}%
      </div>
    </div>
  )
}

interface CandlestickSeriesProps {
  xAxisMap?: Record<string, any>
  yAxisMap?: Record<string, any>
  formattedGraphicalItems?: Array<{
    props: { data: Array<OHLCDataPoint> }
  }>
  offset?: { left: number; top: number; width: number; height: number }
}

function CandlestickSeries(props: CandlestickSeriesProps) {
  const { xAxisMap, yAxisMap, offset } = props

  if (!xAxisMap || !yAxisMap || !offset) return null

  const xAxis = Object.values(xAxisMap)[0]
  const yAxis = Object.values(yAxisMap)[0]

  if (!xAxis || !yAxis) return null

  const { scale: xScale, dataKey: xDataKey } = xAxis
  const { scale: yScale } = yAxis

  // Get data from the chart - it's passed via the Customized component's children access
  const data = xAxis.categoricalDomain?.map(
    (_: string, i: number) => xAxis.data?.[i],
  )

  if (!data || data.length === 0) return null

  // Calculate bar width based on available space
  const bandWidth = offset.width / data.length
  const candleWidth = Math.max(bandWidth * 0.6, 4)

  return (
    <g className="candlestick-series">
      {data.map((point: OHLCDataPoint, index: number) => {
        if (!point) return null

        const isBullish = point.close >= point.open
        const color = isBullish ? BULLISH_COLOR : BEARISH_COLOR
        const filter = `drop-shadow(0 0 4px ${color})`

        // Calculate x position
        const x = xScale(point.date) + offset.left
        const centerX = x

        // Calculate y positions for OHLC
        const highY = yScale(point.high)
        const lowY = yScale(point.low)
        const openY = yScale(point.open)
        const closeY = yScale(point.close)

        const bodyTop = Math.min(openY, closeY)
        const bodyBottom = Math.max(openY, closeY)
        const bodyHeight = Math.max(bodyBottom - bodyTop, 1)

        return (
          <g key={`candle-${index}`} style={{ filter }}>
            {/* Wick (high to low) */}
            <line
              x1={centerX}
              y1={highY}
              x2={centerX}
              y2={lowY}
              stroke={color}
              strokeWidth={1.5}
            />
            {/* Body */}
            <rect
              x={centerX - candleWidth / 2}
              y={bodyTop}
              width={candleWidth}
              height={bodyHeight}
              fill={isBullish ? 'transparent' : color}
              stroke={color}
              strokeWidth={1.5}
              rx={1}
            />
          </g>
        )
      })}
    </g>
  )
}

export function CandlestickChart({ data, companyName }: CandlestickChartProps) {
  // Calculate price domain with padding
  const { minPrice, maxPrice } = useMemo(() => {
    if (!data || data.length === 0) {
      return { minPrice: 0, maxPrice: 100 }
    }

    const allLows = data.map((d) => d.low)
    const allHighs = data.map((d) => d.high)
    const min = Math.min(...allLows)
    const max = Math.max(...allHighs)
    const padding = (max - min) * 0.1

    return {
      minPrice: Math.max(0, min - padding),
      maxPrice: max + padding,
    }
  }, [data])

  if (!data || data.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center text-gray-500">
        No OHLC data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.1)" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tick={{ fill: '#9ca3af', fontSize: 12 }}
          tickFormatter={(value) => {
            const date = new Date(value)
            return date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })
          }}
        />
        <YAxis
          domain={[minPrice, maxPrice]}
          tickLine={false}
          axisLine={false}
          tick={{ fill: '#9ca3af', fontSize: 12 }}
          tickFormatter={(value) => `$${Number(value).toFixed(0)}`}
          width={50}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
        />
        <Customized component={CandlestickSeries} />
        {/* Invisible line for tooltip triggering */}
        <Line
          dataKey="close"
          stroke="transparent"
          dot={false}
          activeDot={false}
          isAnimationActive={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
