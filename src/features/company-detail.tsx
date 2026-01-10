import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from 'lucide-react'
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts'
import { toast } from 'sonner'

import { StockStats } from '@/components/stock-stats'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Input } from '@/components/ui/input'
import { useSimulatedStocks } from '@/hooks/useSimulatedStocks'
import { useMarketStore } from '@/lib/market-store'
import { usePortfolioStore } from '@/lib/portfolio-store'

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
  const [quantity, setQuantity] = useState<string>('1')
  const [isProcessing, setIsProcessing] = useState(false)
  const queryClient = useQueryClient()

  const buyStock = usePortfolioStore((state) => state.buyStock)
  const sellStock = usePortfolioStore((state) => state.sellStock)
  const getHolding = usePortfolioStore((state) => state.getHolding)
  const cash = usePortfolioStore((state) => state.cashBalance)
  const holding = getHolding(company.ticker)
  const chartConfig = {
    [company.name]: {
      label: 'Price',
      color: 'hsl(var(--primary))',
    },
  }

  // Get simulated stock price
  const isInitialized = useMarketStore((state) => state.isInitialized)
  const simulatedStocks = useSimulatedStocks()
  const simulatedStock = simulatedStocks.find((s) => s.name === company.name)

  // Use simulated price if available, otherwise fall back to DB price
  const currentPrice =
    isInitialized && simulatedStock
      ? simulatedStock.currentPrice
      : company.price || 0
  const priceChange =
    isInitialized && simulatedStock ? simulatedStock.changePercent : null
  const quantityNum = parseInt(quantity) || 0
  const estimatedTotal = currentPrice * quantityNum
  const hasValidQuantity = quantityNum > 0
  const canAffordBuy = cash >= estimatedTotal
  const hasEnoughToSell = holding && holding.quantity >= quantityNum

  const handleBuy = async () => {
    if (!hasValidQuantity) {
      toast.error('Please enter a valid quantity')
      return
    }

    if (!canAffordBuy) {
      toast.error('Insufficient cash for this purchase')
      return
    }

    setIsProcessing(true)
    try {
      const success = buyStock(company.ticker, quantityNum, currentPrice)

      if (success) {
        toast.success(
          `Successfully bought ${quantityNum} shares of ${company.ticker} at $${currentPrice.toFixed(2)}`,
        )
        setQuantity('1')
        await queryClient.invalidateQueries()
      } else {
        toast.error('Failed to execute trade')
      }
    } catch (error) {
      toast.error('An error occurred while processing the trade')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSell = async () => {
    if (!hasValidQuantity) {
      toast.error('Please enter a valid quantity')
      return
    }

    if (!hasEnoughToSell) {
      toast.error('Insufficient shares to sell')
      return
    }

    setIsProcessing(true)
    try {
      const success = sellStock(company.ticker, quantityNum, currentPrice)

      if (success) {
        toast.success(
          `Successfully sold ${quantityNum} shares of ${company.ticker} at $${currentPrice.toFixed(2)}`,
        )
        setQuantity('1')
        await queryClient.invalidateQueries()
      } else {
        toast.error('Failed to execute trade')
      }
    } catch (error) {
      toast.error('An error occurred while processing the trade')
    } finally {
      setIsProcessing(false)
    }
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
            <h2 className="text-xl font-semibold mb-4">
              Price Chart (30 Days)
            </h2>
            <div className="h-64 w-full">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <LineChart data={history}>
                  <CartesianGrid
                    vertical={false}
                    stroke="rgba(255,255,255,0.1)"
                  />
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
              <div className="flex justify-between items-center">
                <span>Current Price</span>
                <div className="text-right">
                  <div className="font-mono text-white">
                    ${currentPrice.toFixed(2)}
                  </div>
                  {priceChange !== null && (
                    <div
                      className={`flex items-center justify-end text-xs font-mono ${
                        priceChange > 0
                          ? 'text-green-500'
                          : priceChange < 0
                            ? 'text-red-500'
                            : 'text-gray-400'
                      }`}
                    >
                      {priceChange > 0 ? (
                        <ArrowUpIcon className="w-3 h-3 mr-0.5" />
                      ) : priceChange < 0 ? (
                        <ArrowDownIcon className="w-3 h-3 mr-0.5" />
                      ) : (
                        <MinusIcon className="w-3 h-3 mr-0.5" />
                      )}
                      {Math.abs(priceChange).toFixed(2)}%
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Available Cash</span>
                <span className="font-mono text-cyan-400">
                  ${cash.toFixed(2)}
                </span>
              </div>

              {holding && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Your Holdings</span>
                  <span className="font-mono text-cyan-400">
                    {holding.quantity} shares
                  </span>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Quantity</label>
                <Input
                  type="number"
                  min="1"
                  step="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="font-mono"
                  disabled={isProcessing}
                />
              </div>

              {hasValidQuantity && (
                <div className="flex justify-between p-3 bg-black/30 rounded border border-gray-700">
                  <span className="text-gray-400">Estimated Total</span>
                  <span className="font-mono text-white font-semibold">
                    ${estimatedTotal.toFixed(2)}
                  </span>
                </div>
              )}

              {!canAffordBuy && hasValidQuantity && (
                <div className="text-sm text-red-500 text-center">
                  Insufficient cash for this purchase
                </div>
              )}

              {!hasEnoughToSell && hasValidQuantity && (
                <div className="text-sm text-red-500 text-center">
                  Insufficient shares to sell
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleBuy}
                  disabled={isProcessing || !hasValidQuantity || !canAffordBuy}
                  className="flex-1 bg-neon-blue text-black font-bold py-2 rounded hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-neon-blue transition-colors"
                >
                  {isProcessing ? 'PROCESSING...' : 'BUY'}
                </button>
                <button
                  onClick={handleSell}
                  disabled={
                    isProcessing || !hasValidQuantity || !hasEnoughToSell
                  }
                  className="flex-1 bg-red-600 text-white font-bold py-2 rounded hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-600 transition-colors"
                >
                  {isProcessing ? 'PROCESSING...' : 'SELL'}
                </button>
              </div>
            </div>
          </div>

          <StockStats
            companyId={String(company.id)}
            simulatedStock={simulatedStock}
            currentPrice={currentPrice}
          />
        </div>
      </div>
    </div>
  )
}
