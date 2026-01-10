import { create } from 'zustand'

import { calculateNextPrice, getVolatilityBySector } from './price-simulation'

/**
 * Stock price data with simulation metadata
 */
export interface SimulatedStock {
  id: string
  ticker: string
  name: string
  sector: string
  currentPrice: number
  previousPrice: number
  changePercent: number
  lastUpdate: Date
  volatility: number
  // Day stats for tracking intraday high/low
  dayOpen: number
  dayHigh: number
  dayLow: number
}

/**
 * Market status enum
 */
export enum MarketStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

interface MarketState {
  // Market configuration
  status: MarketStatus
  tickInterval: number // milliseconds between price updates
  lastTickTime: Date | null

  // Stock data
  stocks: Map<string, SimulatedStock>
  isInitialized: boolean

  // Actions
  setMarketStatus: (status: MarketStatus) => void
  setTickInterval: (interval: number) => void
  initializeStocks: (
    stockData: Array<{
      id: string
      ticker: string
      name: string
      sector: string
      price: number
    }>,
  ) => void
  updatePrices: () => void
  getStockByTicker: (ticker: string) => SimulatedStock | undefined
  getStockById: (id: string) => SimulatedStock | undefined
  getAllStocks: () => Array<SimulatedStock>
  reset: () => void
}

/**
 * Market simulation store using Zustand.
 * Manages current stock prices and market status.
 */
export const useMarketStore = create<MarketState>((set, get) => ({
  // Initial state
  status: MarketStatus.OPEN,
  tickInterval: 4000, // 4 seconds (middle of 3-5s range)
  lastTickTime: null,
  stocks: new Map(),
  isInitialized: false,

  // Set market status (OPEN/CLOSED)
  setMarketStatus: (status: MarketStatus) => {
    set({ status })
  },

  // Set tick interval in milliseconds
  setTickInterval: (interval: number) => {
    if (interval < 1000 || interval > 10000) {
      console.warn('Tick interval should be between 1-10 seconds')
      return
    }
    set({ tickInterval: interval })
  },

  // Initialize stocks from database data
  initializeStocks: (stockData) => {
    const stocksMap = new Map<string, SimulatedStock>()

    for (const stock of stockData) {
      const volatility = getVolatilityBySector(stock.sector)
      stocksMap.set(stock.id, {
        id: stock.id,
        ticker: stock.ticker,
        name: stock.name,
        sector: stock.sector,
        currentPrice: stock.price,
        previousPrice: stock.price,
        changePercent: 0,
        lastUpdate: new Date(),
        volatility,
        // Initialize day stats - price at market open is the starting point
        dayOpen: stock.price,
        dayHigh: stock.price,
        dayLow: stock.price,
      })
    }

    set({
      stocks: stocksMap,
      isInitialized: true,
      lastTickTime: new Date(),
    })
  },

  // Update all stock prices (called on each tick)
  updatePrices: () => {
    const state = get()

    if (state.status !== MarketStatus.OPEN || !state.isInitialized) {
      return
    }

    const updatedStocks = new Map(state.stocks)

    for (const [id, stock] of updatedStocks) {
      const priceUpdate = calculateNextPrice(
        stock.currentPrice,
        stock.volatility,
      )

      const newPrice = priceUpdate.price

      updatedStocks.set(id, {
        ...stock,
        previousPrice: stock.currentPrice,
        currentPrice: newPrice,
        changePercent: priceUpdate.changePercent,
        lastUpdate: priceUpdate.timestamp,
        // Update day high/low if new price exceeds current bounds
        dayHigh: Math.max(stock.dayHigh, newPrice),
        dayLow: Math.min(stock.dayLow, newPrice),
      })
    }

    set({
      stocks: updatedStocks,
      lastTickTime: new Date(),
    })
  },

  // Get stock by ticker symbol
  getStockByTicker: (ticker: string) => {
    const state = get()
    for (const stock of state.stocks.values()) {
      if (stock.ticker === ticker) {
        return stock
      }
    }
    return undefined
  },

  // Get stock by ID
  getStockById: (id: string) => {
    const state = get()
    return state.stocks.get(id)
  },

  // Get all stocks as array
  getAllStocks: () => {
    const state = get()
    return Array.from(state.stocks.values())
  },

  // Reset market state
  reset: () => {
    set({
      stocks: new Map(),
      isInitialized: false,
      lastTickTime: null,
    })
  },
}))
