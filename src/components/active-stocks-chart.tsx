import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import type { ChartConfig } from "@/components/ui/chart";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { company_data } from "@/lib/company-data";

// Select 10 random companies for the chart
const topCompanies = [...company_data].sort(() => 0.5 - Math.random()).slice(0, 10)

// Generate mock historical data
const generateMockData = (months: number) => {
  const data = []
  const now = new Date()
  const days = months * 30
  
  // Track trend state for each company
  const companyTrends: Record<string, { trend: number, duration: number, price: number }> = {}

  for (let i = days; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    
    const point: any = {
      date: date.toISOString().split('T')[0],
    }

    topCompanies.forEach((company, index) => {
      // Initialize trend state if not present
      if (!companyTrends[company.name]) {
        companyTrends[company.name] = {
          trend: 0,
          duration: 0,
          price: 100 + index * 10 // Base price
        }
      }

      const state = companyTrends[company.name]

      // Update trend
      if (state.duration <= 0) {
        state.trend = (Math.random() * 0.08) - 0.04 // -4% to +4% daily trend
        state.duration = Math.floor(Math.random() * 15) + 5 // 5-20 days
      }
      state.duration--

      // Daily volatility
      let noise = (Math.random() * 0.10) - 0.05 // -5% to +5% noise
      
      // Occasional shock
      if (Math.random() < 0.02) {
        noise += (Math.random() * 0.40) - 0.20 // +/- 20% shock
      }

      const change = state.trend + noise
      state.price = state.price * (1 + change)
      
      point[company.name] = Math.max(1, state.price)
    })

    data.push(point)
  }
  return data.reverse() // Reverse to get chronological order
}

const chartConfig = topCompanies.reduce((acc, company, index) => {
  const colors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
    "var(--chart-6)",
    "var(--chart-7)",
    "var(--chart-8)",
    "var(--chart-9)",
    "var(--chart-10)",
  ]
  
  acc[company.name] = {
    label: company.name,
    color: colors[index % colors.length],
  }
  return acc
}, {} as ChartConfig)

export function ActiveStocksChart() {
  const [timeRange, setTimeRange] = React.useState<"12m" | "6m" | "3m" | "1m">("3m")
  
  const data = React.useMemo(() => {
    const months = parseInt(timeRange.replace("m", ""))
    return generateMockData(months)
  }, [timeRange])

  return (
    <Card className="col-span-1 md:col-span-3 border-cyan-800/50 bg-black/50">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b border-cyan-800/50 py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle className="text-cyan-500">Market Trends</CardTitle>
          <CardDescription>
            Showing random selection of stocks for the last {timeRange}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
            {["12m", "6m", "3m", "1m"].map((range) => (
                <Button
                    key={range}
                    variant={timeRange === range ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeRange(range as any)}
                    className={timeRange === range ? "bg-cyan-600 hover:bg-cyan-700" : "border-cyan-800/50 text-cyan-500 hover:text-neon-blue hover:border-neon-blue"}
                >
                    {range}
                </Button>
            ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-62.5 w-full">
          <LineChart data={data}>
            <CartesianGrid vertical={false} stroke="rgba(6,182,212,0.1)" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
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
              content={<ChartTooltipContent labelFormatter={(value) => {
                return new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                })
              }} />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            {topCompanies.map((company) => (
              <Line
                key={company.name}
                dataKey={company.name}
                type="monotone"
                stroke={`var(--color-${company.name})`}
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
