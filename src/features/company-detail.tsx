import { CartesianGrid, Line, LineChart, XAxis } from 'recharts'

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart'

interface CompanyDetailProps {
  company: {
    id: number
    name: string
    ticker: string
    sector: string
    price: number | null
    image?: string
    known_affiliations: Array<string>
    type: Array<string>
  }
  history: Array<{
    date: string
    [key: string]: number | string
  }>
}

export function CompanyDetail({ company, history }: CompanyDetailProps) {
  const chartConfig = {
    [company.name]: {
      label: 'Price',
      color: 'hsl(var(--primary))',
    },
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {company.image && (
          <img
            src={company.image}
            alt={company.name}
            className="w-20 h-20 object-contain"
          />
        )}
        <div>
          <h1 className="text-4xl font-bold text-cyan-500">{company.name}</h1>
          <p className="text-xl text-gray-400">{company.type.join(', ')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="p-6 border border-gray-700 rounded bg-card">
            <h2 className="text-xl font-semibold mb-4">Price Chart (30 Days)</h2>
            <div className="h-64 w-full">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <LineChart data={history}>
                  <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    tickFormatter={(value) => {
                      const date = new Date(value)
                      return date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })
                    }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    dataKey={company.name}
                    type="monotone"
                    stroke="var(--color-price)"
                    strokeWidth={2}
                    dot={false}
                    style={
                      {
                        '--color-price': 'var(--color-primary)',
                      } as React.CSSProperties
                    }
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </div>

          <div className="p-6 border border-gray-700 rounded bg-card">
            <h2 className="text-xl font-semibold mb-2">Affiliations</h2>
            <div className="flex flex-wrap gap-2">
              {company.known_affiliations.length > 0 ? (
                company.known_affiliations.map((aff: string) => (
                  <span
                    key={aff}
                    className="px-2 py-1 bg-gray-800 rounded text-sm"
                  >
                    {aff}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">None known</span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-6 border border-neon-blue rounded bg-card">
            <h2 className="text-xl font-semibold mb-4">Trade {company.name}</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Current Price</span>
                <span className="font-mono text-white">
                  ${company.price?.toFixed(2) ?? 'N/A'}
                </span>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-neon-blue text-black font-bold py-2 rounded hover:bg-blue-400">
                  BUY
                </button>
                <button className="flex-1 bg-red-600 text-white font-bold py-2 rounded hover:bg-red-500">
                  SELL
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
