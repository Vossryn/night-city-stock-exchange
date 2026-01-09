/**
 * Daily Snapshot State Management with Zustand
 * Captures "start of day" prices to calculate daily P/L
 * Uses localStorage for persistence, scoped by userId
 */

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

// Types
export interface DailySnapshot {
  snapshotTimestamp: number
  portfolioValueAtStart: number
  stockPricesAtStart: Record<string, number> // ticker -> price
}

interface DailySnapshotState {
  userId: string | null
  currentDaySnapshot: DailySnapshot | null

  // Actions
  captureSnapshot: (
    portfolioValue: number,
    stockPrices: Record<string, number>,
  ) => void
  getStockPriceAtStart: (ticker: string) => number | undefined
  getDailyPL: (currentValue: number) => { value: number; percent: number }
  loadUserSnapshot: (userId: string) => void
  clearSnapshot: () => void
  hasSnapshot: () => boolean
}

const DEFAULT_STATE = {
  userId: null,
  currentDaySnapshot: null,
}

/**
 * Create daily snapshot store with localStorage persistence scoped by userId
 */
export const useDailySnapshotStore = create<DailySnapshotState>()(
  persist(
    (set, get) => ({
      // Initial state
      ...DEFAULT_STATE,

      /**
       * Capture a new daily snapshot
       * Called when market initializes and no snapshot exists
       */
      captureSnapshot: (
        portfolioValue: number,
        stockPrices: Record<string, number>,
      ) => {
        set({
          currentDaySnapshot: {
            snapshotTimestamp: Date.now(),
            portfolioValueAtStart: portfolioValue,
            stockPricesAtStart: stockPrices,
          },
        })
      },

      /**
       * Get the price of a stock at the start of the day
       */
      getStockPriceAtStart: (ticker: string): number | undefined => {
        const snapshot = get().currentDaySnapshot
        if (!snapshot) return undefined
        return snapshot.stockPricesAtStart[ticker]
      },

      /**
       * Calculate daily P/L based on current portfolio value
       */
      getDailyPL: (
        currentValue: number,
      ): { value: number; percent: number } => {
        const snapshot = get().currentDaySnapshot
        if (!snapshot) return { value: 0, percent: 0 }

        const valueDiff = currentValue - snapshot.portfolioValueAtStart
        const percentDiff =
          snapshot.portfolioValueAtStart > 0
            ? (valueDiff / snapshot.portfolioValueAtStart) * 100
            : 0

        return { value: valueDiff, percent: percentDiff }
      },

      /**
       * Load snapshot for a specific user
       * Called when user logs in
       */
      loadUserSnapshot: (userId: string) => {
        const state = get()

        // If switching users, load their snapshot data from localStorage
        if (state.userId !== userId) {
          const storageKey = `ncse-daily-snapshot-${userId}`
          const stored = localStorage.getItem(storageKey)

          if (stored) {
            try {
              const parsed = JSON.parse(stored)
              set({
                ...parsed.state,
                userId,
              })
            } catch (error) {
              // If parsing fails, start fresh for this user
              console.error('Failed to load daily snapshot:', error)
              set({
                ...DEFAULT_STATE,
                userId,
              })
            }
          } else {
            // No saved snapshot, start fresh for this user
            set({
              ...DEFAULT_STATE,
              userId,
            })
          }
        }
      },

      /**
       * Clear the current snapshot
       * Called when user logs out
       */
      clearSnapshot: () => {
        set(DEFAULT_STATE)
      },

      /**
       * Check if a snapshot exists
       */
      hasSnapshot: (): boolean => {
        return get().currentDaySnapshot !== null
      },
    }),
    {
      name: 'ncse-daily-snapshot',
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          // Try to get user-specific storage
          const state = useDailySnapshotStore.getState()
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
          } catch {
            // If parsing fails, use generic key
          }
          localStorage.setItem(name, value)
        },
        removeItem: (name) => {
          // Try to remove user-specific storage
          const state = useDailySnapshotStore.getState()
          if (state.userId) {
            const userKey = `${name}-${state.userId}`
            localStorage.removeItem(userKey)
          }
          // Also remove generic key
          localStorage.removeItem(name)
        },
      })),
    },
  ),
)
