/**
 * Portfolio State Management with Zustand
 * Manages user portfolio including cash balance, holdings, and transaction history
 * Uses localStorage for persistence, scoped by userId
 */

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

// Types
export interface Holding {
  quantity: number
  averageCost: number
}

export interface Transaction {
  id: string
  timestamp: Date
  type: 'BUY' | 'SELL'
  symbol: string
  quantity: number
  price: number
  total: number
}

interface PortfolioState {
  userId: string | null
  cashBalance: number
  holdings: Record<string, Holding>
  transactions: Array<Transaction>
  buyStock: (symbol: string, quantity: number, price: number) => boolean
  sellStock: (symbol: string, quantity: number, price: number) => boolean
  getHolding: (symbol: string) => Holding | undefined
  getTotalPortfolioValue: (currentPrices: Record<string, number>) => number
  resetPortfolio: () => void
  loadUserPortfolio: (userId: string) => void
  clearPortfolio: () => void
}

// Constants
const STARTING_CASH = 100000 // 100k credits starting balance

const DEFAULT_STATE = {
  userId: null,
  cashBalance: STARTING_CASH,
  holdings: {},
  transactions: [],
}

/**
 * Create portfolio store with localStorage persistence scoped by userId
 */
export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set, get) => ({
      // Initial state
      ...DEFAULT_STATE,

      // Actions
      /**
       * Buy stock - validates cash and updates holdings
       * Returns true if successful, false if insufficient funds
       */
      buyStock: (symbol: string, quantity: number, price: number): boolean => {
        const state = get()
        const total = quantity * price

        // Validate cash balance
        if (state.cashBalance < total) {
          return false
        }

        // Get current holding or create new one
        const currentHolding = state.holdings[symbol]
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        const newHolding: Holding = currentHolding
          ? {
              quantity: currentHolding.quantity + quantity,
              averageCost:
                (currentHolding.quantity * currentHolding.averageCost +
                  quantity * price) /
                (currentHolding.quantity + quantity),
            }
          : {
              quantity,
              averageCost: price,
            }

        // Create transaction record
        const transaction: Transaction = {
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          timestamp: new Date(),
          type: 'BUY',
          symbol,
          quantity,
          price,
          total,
        }

        // Update state
        set({
          cashBalance: state.cashBalance - total,
          holdings: {
            ...state.holdings,
            [symbol]: newHolding,
          },
          transactions: [transaction, ...state.transactions],
        })

        return true
      },

      /**
       * Sell stock - validates holdings and updates state
       * Returns true if successful, false if insufficient shares
       */
      sellStock: (symbol: string, quantity: number, price: number): boolean => {
        const state = get()
        const currentHolding = state.holdings[symbol]

        // Validate holding exists and has enough shares
        if (
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          currentHolding === undefined ||
          currentHolding.quantity < quantity
        ) {
          return false
        }

        const total = quantity * price
        const newQuantity = currentHolding.quantity - quantity

        // Update or remove holding
        const newHoldings = { ...state.holdings }
        if (newQuantity === 0) {
          delete newHoldings[symbol]
        } else {
          newHoldings[symbol] = {
            ...currentHolding,
            quantity: newQuantity,
          }
        }

        // Create transaction record
        const transaction: Transaction = {
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          timestamp: new Date(),
          type: 'SELL',
          symbol,
          quantity,
          price,
          total,
        }

        // Update state
        set({
          cashBalance: state.cashBalance + total,
          holdings: newHoldings,
          transactions: [transaction, ...state.transactions],
        })

        return true
      },

      /**
       * Get holding information for a symbol
       */
      getHolding: (symbol: string): Holding | undefined => {
        return get().holdings[symbol]
      },

      /**
       * Calculate total portfolio value (cash + stock value at current prices)
       */
      getTotalPortfolioValue: (
        currentPrices: Record<string, number>,
      ): number => {
        const state = get()
        let stockValue = 0

        // Calculate value of all holdings
        for (const [symbol, holding] of Object.entries(state.holdings)) {
          const currentPrice = currentPrices[symbol]
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (currentPrice !== undefined) {
            stockValue += holding.quantity * currentPrice
          }
        }

        return state.cashBalance + stockValue
      },

      /**
       * Reset portfolio to starting state (keeps userId)
       */
      resetPortfolio: () => {
        const userId = get().userId
        set({
          ...DEFAULT_STATE,
          userId,
        })
      },

      /**
       * Load portfolio for a specific user
       * Called when user logs in
       */
      loadUserPortfolio: (userId: string) => {
        const state = get()

        // If switching users, load their portfolio data from localStorage
        if (state.userId !== userId) {
          // Clear current state and set new userId
          // The persist middleware will attempt to load saved data for this user
          const storageKey = `ncse-portfolio-${userId}`
          const stored = localStorage.getItem(storageKey)

          if (stored) {
            try {
              const parsed = JSON.parse(stored)
              // Parse transaction dates back to Date objects
              if (parsed.state?.transactions) {
                parsed.state.transactions = parsed.state.transactions.map(
                  (t: Transaction) => ({
                    ...t,
                    timestamp: new Date(t.timestamp),
                  }),
                )
              }
              // Load the saved portfolio
              set({
                ...parsed.state,
                userId, // Ensure userId is set correctly
              })
            } catch (error) {
              // If parsing fails, start fresh for this user
              console.error('Failed to load portfolio:', error)
              set({
                ...DEFAULT_STATE,
                userId,
              })
            }
          } else {
            // No saved portfolio, start fresh for this user
            set({
              ...DEFAULT_STATE,
              userId,
            })
          }
        }
      },

      /**
       * Clear portfolio state
       * Called when user logs out
       */
      clearPortfolio: () => {
        set(DEFAULT_STATE)
      },
    }),
    {
      name: 'ncse-portfolio',
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          // Try to get user-specific storage
          const state = usePortfolioStore.getState()
          if (state.userId) {
            const userKey = `${name}-${state.userId}`
            const item = localStorage.getItem(userKey)
            if (item) return item
          }
          // Fall back to generic key
          return localStorage.getItem(name)
        },
        setItem: (name, value) => {
          // Parse to get userId
          try {
            const parsed = JSON.parse(value)
            if (parsed.state?.userId) {
              // Save to user-specific key
              const userKey = `${name}-${parsed.state.userId}`
              localStorage.setItem(userKey, value)
              return
            }
          } catch (e) {
            // If parsing fails, use generic key
          }
          localStorage.setItem(name, value)
        },
        removeItem: (name) => {
          // Try to remove user-specific storage
          const state = usePortfolioStore.getState()
          if (state.userId) {
            const userKey = `${name}-${state.userId}`
            localStorage.removeItem(userKey)
          }
          // Also remove generic key
          localStorage.removeItem(name)
        },
      })),
      // Serialize dates properly
      serialize: (state) => {
        return JSON.stringify({
          state: {
            ...state,
            transactions: state.transactions.map((t) => ({
              ...t,
              timestamp: t.timestamp.toISOString(),
            })),
          },
        })
      },
      deserialize: (str) => {
        const parsed = JSON.parse(str)
        if (parsed.state?.transactions) {
          parsed.state.transactions = parsed.state.transactions.map(
            (t: Transaction & { timestamp: string }) => ({
              ...t,
              timestamp: new Date(t.timestamp),
            }),
          )
        }
        return parsed
      },
    },
  ),
)

/**
 * Helper function to format currency values with cyberpunk styling
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace('$', '€$') // Cyberpunk Eurodollar styling
}

/**
 * Helper function to get gain/loss info for a holding
 */
export function getHoldingGainLoss(
  holding: Holding,
  currentPrice: number,
): {
  gainLoss: number
  gainLossPercent: number
  totalValue: number
  totalCost: number
} {
  const totalCost = holding.quantity * holding.averageCost
  const totalValue = holding.quantity * currentPrice
  const gainLoss = totalValue - totalCost
  const gainLossPercent = (gainLoss / totalCost) * 100

  return {
    gainLoss,
    gainLossPercent,
    totalValue,
    totalCost,
  }
}
