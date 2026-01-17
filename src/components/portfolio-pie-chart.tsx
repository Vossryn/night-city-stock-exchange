import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

import type { AllocationData } from '@/hooks/usePortfolioAnalytics'

// Cyberpunk-themed colors for different sectors
const SECTOR_COLORS: Record<string, string> = {
  Technology: '#00ffff', // cyan
  'Consumer Goods': '#ff00ff', // magenta
  'Financial Services': '#ffff00', // yellow
  Healthcare: '#00ff88', // neon green
  'Heavy Industry': '#ff5500', // orange
  Media: '#ff0088', // hot pink
  Security: '#ff3300', // red-orange
  Transportation: '#00aaff', // sky blue
  Energy: '#ffaa00', // amber
  Telecommunications: '#8800ff', // purple
  Biotechnology: '#00ff00', // lime
  'Military Contractors': '#ff0000', // red
  Conglomerate: '#aaaaaa', // gray
  // Add more sectors as needed
}

// Fallback colors for sectors not in the map
const FALLBACK_COLORS = [
  '#00ffff',
  '#ff00ff',
  '#ffff00',
  '#00ff88',
  '#ff5500',
  '#ff0088',
  '#00aaff',
  '#ffaa00',
  '#8800ff',
  '#00ff00',
]

interface PortfolioPieChartProps {
  data: Array<AllocationData>
  title?: string
}

export function PortfolioPieChart({
  data,
  title = 'Portfolio Allocation',
}: PortfolioPieChartProps) {
  if (data.length === 0) {
    return (
      <div className="p-6 border border-gray-700 rounded bg-card">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <div className="flex items-center justify-center h-64 text-gray-500 font-mono">
          NO HOLDINGS TO DISPLAY
        </div>
      </div>
    )
  }

  const getColor = (name: string, index: number): string => {
    return (
      SECTOR_COLORS[name] || FALLBACK_COLORS[index % FALLBACK_COLORS.length]
    )
  }

  return (
    <div className="p-6 border border-gray-700 rounded bg-card">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={90}
              paddingAngle={2}
              label={({ name, percentage }) =>
                `${name.length > 12 ? name.slice(0, 12) + '...' : name} (${percentage.toFixed(1)}%)`
              }
              labelLine={{ stroke: 'rgba(255,255,255,0.3)', strokeWidth: 1 }}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getColor(entry.name, index)}
                  stroke="rgba(0,0,0,0.5)"
                  strokeWidth={1}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Value']}
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.9)',
                border: '1px solid rgba(0,255,255,0.3)',
                borderRadius: '4px',
                color: '#00ffff',
              }}
              labelStyle={{ color: '#ffffff' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3 justify-center">
        {data.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: getColor(entry.name, index) }}
            />
            <span className="text-gray-300">{entry.name}</span>
            <span className="text-gray-500 font-mono">
              ({entry.percentage.toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
