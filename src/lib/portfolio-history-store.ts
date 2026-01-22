/**
 * Portfolio History State Management with Zustand
 * Tracks historical portfolio values over time for charting
 * Uses localStorage persistence, scoped by userId
 */

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

// Types
export interface HistoricalDataPoint {
  timestamp: number // Unix timestamp
  date: string // YYYY-MM-DD format (for deduplication)
  portfolioValue: number // Total net worth
  cashBalance: number // Cash component
  holdingsValue: number // Stock value component
}

interface PortfolioHistoryState {
  userId: string | null
  history: Array<HistoricalDataPoint>
  maxHistoryDays: number

  // Actions
  captureDataPoint: (
    portfolioValue: number,
    cashBalance: number,
    holdingsValue: number,
  ) => void
  loadUserHistory: (userId: string) => void
  clearHistory: () => void
  getHistoryForChart: (days?: number) => Array<{
    date: string
    value: number
    cash: number
    holdings: number
  }>
  hasTodaySnapshot: () => boolean
}

const MAX_HISTORY_DAYS = 30

const DEFAULT_STATE = {
  userId: null,
  history: [] as Array<HistoricalDataPoint>,
  maxHistoryDays: MAX_HISTORY_DAYS,
}

function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0]
}

export const usePortfolioHistoryStore = create<PortfolioHistoryState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,

      /**
       * Capture a new historical data point
       * Only one snapshot per calendar day (updates if same day)
       */
      captureDataPoint: (
        portfolioValue: number,
        cashBalance: number,
        holdingsValue: number,
      ) => {
        const today = getTodayDateString()
        const state = get()

        // Check if we already have today's snapshot
        const existingTodayIndex = state.history.findIndex(
          (h) => h.date === today,
        )

        const newDataPoint: HistoricalDataPoint = {
          timestamp: Date.now(),
          date: today,
          portfolioValue,
          cashBalance,
          holdingsValue,
        }

        let newHistory: Array<HistoricalDataPoint>

        if (existingTodayIndex >= 0) {
          // Update today's snapshot
          newHistory = [...state.history]
          newHistory[existingTodayIndex] = newDataPoint
        } else {
          // Add new snapshot, keep only last 30 days
          newHistory = [...state.history, newDataPoint]
            .sort((a, b) => a.timestamp - b.timestamp)
            .slice(-MAX_HISTORY_DAYS)
        }

        set({ history: newHistory })
      },

      /**
       * Load history for a specific user
       * Called when user logs in
       */
      loadUserHistory: (userId: string) => {
        const state = get()
        if (state.userId !== userId) {
          const storageKey = `ncse-portfolio-history-${userId}`
          const stored = localStorage.getItem(storageKey)

          if (stored) {
            try {
              const parsed = JSON.parse(stored)
              set({ ...parsed.state, userId })
            } catch {
              set({ ...DEFAULT_STATE, userId })
            }
          } else {
            set({ ...DEFAULT_STATE, userId })
          }
        }
      },

      /**
       * Clear history state
       * Called when user logs out
       */
      clearHistory: () => {
        set(DEFAULT_STATE)
      },

      /**
       * Get history data formatted for chart display
       */
      getHistoryForChart: (days = 30) => {
        const history = get().history
        const cutoff = Date.now() - days * 24 * 60 * 60 * 1000

        return history
          .filter((h) => h.timestamp >= cutoff)
          .map((h) => ({
            date: h.date,
            value: h.portfolioValue,
            cash: h.cashBalance,
            holdings: h.holdingsValue,
          }))
      },

      /**
       * Check if we already have a snapshot for today
       */
      hasTodaySnapshot: () => {
        const today = getTodayDateString()
        return get().history.some((h) => h.date === today)
      },
    }),
    {
      name: 'ncse-portfolio-history',
      storage: createJSONStorage(() => ({
        getItem: (name: string): string | null => {
          // Avoid circular reference by parsing stored data directly
          const stored = localStorage.getItem(name)
          if (stored) {
            try {
              const parsed = JSON.parse(stored)
              if (parsed.state?.userId) {
                const userKey = `${name}-${parsed.state.userId}`
                const userStored = localStorage.getItem(userKey)
                if (userStored) return userStored
              }
            } catch {
              // Fall through to generic key
            }
          }
          return localStorage.getItem(name)
        },
        setItem: (name: string, value: string): void => {
          try {
            const parsed = JSON.parse(value)
            if (parsed.state?.userId) {
              localStorage.setItem(`${name}-${parsed.state.userId}`, value)
              return
            }
          } catch {
            // If parsing fails, use generic key
          }
          localStorage.setItem(name, value)
        },
        removeItem: (name: string): void => {
          // Remove both generic and user-specific keys
          const stored = localStorage.getItem(name)
          if (stored) {
            try {
              const parsed = JSON.parse(stored)
              if (parsed.state?.userId) {
                localStorage.removeItem(`${name}-${parsed.state.userId}`)
              }
            } catch {
              // Ignore parsing errors
            }
          }
          localStorage.removeItem(name)
        },
      })),
    },
  ),
)
