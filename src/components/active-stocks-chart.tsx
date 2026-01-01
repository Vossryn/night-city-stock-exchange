import * as React from 'react'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'

import type { ChartConfig } from '@/components/ui/chart'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  useGetActiveStocks,
  useGetMarketHistory,
} from '@/hooks/useGetActiveStocks'

export function ActiveStocksChart() {
  const [timeRange, setTimeRange] = React.useState<'12m' | '6m' | '3m' | '1m'>(
    '3m',
  )

  const { data: stocks, isLoading: isLoadingStocks } = useGetActiveStocks()

  const topCompanies = React.useMemo(() => {
    if (!stocks) return []
    // Take the first 10 companies for a consistent chart
    return [...stocks].sort((a, b) => a.name.localeCompare(b.name)).slice(0, 10)
  }, [stocks])

  const companyIds = React.useMemo(
    () => topCompanies.map((c) => c.id),
    [topCompanies],
  )

  const days = React.useMemo(() => {
    const months = parseInt(timeRange.replace('m', ''))
    return months * 30
  }, [timeRange])

  const { data: historyData, isLoading: isLoadingHistory } =
    useGetMarketHistory(days, companyIds)

  const chartConfig = React.useMemo(() => {
    const colors = [
      'var(--chart-1)',
      'var(--chart-2)',
      'var(--chart-3)',
      'var(--chart-4)',
      'var(--chart-5)',
      'var(--chart-6)',
      'var(--chart-7)',
      'var(--chart-8)',
      'var(--chart-9)',
      'var(--chart-10)',
    ]

    return topCompanies.reduce((acc, company, index) => {
      acc[company.name] = {
        label: company.name,
        color: colors[index % colors.length],
      }
      return acc
    }, {} as ChartConfig)
  }, [topCompanies])

  if (isLoadingStocks || isLoadingHistory) {
    return (
      <Card className="col-span-1 md:col-span-3 border-cyan-800/50 bg-black/50">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b border-cyan-800/50 py-5 sm:flex-row">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <CardTitle className="text-cyan-500">Market Trends</CardTitle>
            <CardDescription>Loading market data...</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 flex items-center justify-center h-62.5">
          <div className="text-cyan-500/50 font-mono animate-pulse">
            INITIALIZING DATA STREAM...
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-1 md:col-span-3 border-cyan-800/50 bg-black/50">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b border-cyan-800/50 py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle className="text-cyan-500">Market Trends</CardTitle>
          <CardDescription>
            Showing performance of top {topCompanies.length} companies for the
            last {timeRange}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          {['12m', '6m', '3m', '1m'].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range as any)}
              className={
                timeRange === range
                  ? 'bg-cyan-600 hover:bg-cyan-700'
                  : 'border-cyan-800/50 text-cyan-500 hover:text-neon-blue hover:border-neon-blue'
              }
            >
              {range}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-62.5 w-full"
        >
          <LineChart data={historyData}>
            <CartesianGrid vertical={false} stroke="rgba(6,182,212,0.1)" />
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
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  }}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            {topCompanies.map((company) => (
              <Line
                key={company.name}
                dataKey={company.name}
                type="monotone"
                stroke={`var(--color-${company.name.replace(/[^a-zA-Z0-9-]/g, '_')})`}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
