import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import type { ChartConfig } from "@/components/ui/chart";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { company_data } from "@/lib/company-data";

// Select 10 random companies (mocking "most active" for now)
const topCompanies = [...company_data].sort(() => 0.5 - Math.random()).slice(0, 10)

// Generate mock historical data
const generateMockData = (months: number) => {
  const data = []
  const now = new Date()
  const days = months * 30
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    
    const point: any = {
      date: date.toISOString().split('T')[0],
    }

    topCompanies.forEach((company, index) => {
      // Random walk price generation
      // Base price around 100 + index * 10
      // Volatility
      const basePrice = 100 + index * 10
      const volatility = 5
      const randomChange = (Math.random() - 0.5) * volatility
      // Add some trend based on index to make them distinct
      const trend = Math.sin(i / 30) * 10
      
      point[company.name] = Math.max(0, basePrice + randomChange + trend + (Math.random() * i/10))
    })

    data.push(point)
  }
  return data
}

const chartConfig = topCompanies.reduce((acc, company, index) => {
  const colors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
    "var(--chart-1)", // Reuse or generate more distinct colors
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
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
          <CardTitle className="text-cyan-500">Most Active Stocks</CardTitle>
          <CardDescription>
            Showing top 10 active stocks for the last {timeRange}
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
