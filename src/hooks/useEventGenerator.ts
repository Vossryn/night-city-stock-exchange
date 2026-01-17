import { useEffect, useRef } from 'react'

import { useEventsStore } from '@/lib/events-store'
import { MarketStatus, useMarketStore } from '@/lib/market-store'

/**
 * Configuration for event generation
 */
interface EventGeneratorConfig {
  checkIntervalMs: number // How often to check for new events
  triggerChance: number // Probability of triggering an event each check (0-1)
  maxActiveEvents: number // Maximum simultaneous active events
}

const DEFAULT_CONFIG: EventGeneratorConfig = {
  checkIntervalMs: 30000, // Check every 30 seconds
  triggerChance: 0.3, // 30% chance per check
  maxActiveEvents: 3, // Max 3 events at once
}

/**
 * Hook to automatically generate random market events.
 * Should be called once at the app root level.
 *
 * @param config - Optional configuration overrides
 */
export function useEventGenerator(config: Partial<EventGeneratorConfig> = {}) {
  const fullConfig = { ...DEFAULT_CONFIG, ...config }

  const marketStatus = useMarketStore((state) => state.status)
  const isInitialized = useMarketStore((state) => state.isInitialized)

  const activeEvents = useEventsStore((state) => state.activeEvents)
  const generateRandomEvent = useEventsStore(
    (state) => state.generateRandomEvent,
  )
  const triggerEvent = useEventsStore((state) => state.triggerEvent)
  const cleanupExpiredEvents = useEventsStore(
    (state) => state.cleanupExpiredEvents,
  )

  // Use ref to track interval
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Only run when market is open and initialized
    if (marketStatus !== MarketStatus.OPEN || !isInitialized) {
      // Clear interval if market closes
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    // Set up event generation interval
    intervalRef.current = setInterval(() => {
      // First, cleanup any expired events
      cleanupExpiredEvents()

      // Check if we can trigger a new event
      const currentActiveCount = useEventsStore.getState().activeEvents.length

      if (currentActiveCount >= fullConfig.maxActiveEvents) {
        return // Already at max events
      }

      // Random chance to trigger event
      if (Math.random() < fullConfig.triggerChance) {
        const newEvent = generateRandomEvent()
        triggerEvent(newEvent)
      }
    }, fullConfig.checkIntervalMs)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [
    marketStatus,
    isInitialized,
    fullConfig.checkIntervalMs,
    fullConfig.triggerChance,
    fullConfig.maxActiveEvents,
    generateRandomEvent,
    triggerEvent,
    cleanupExpiredEvents,
  ])

  return {
    activeEventsCount: activeEvents.length,
    isGenerating: marketStatus === MarketStatus.OPEN && isInitialized,
  }
}

/**
 * Hook to manually trigger an event (for testing/demo purposes)
 */
export function useTriggerEvent() {
  const generateRandomEvent = useEventsStore(
    (state) => state.generateRandomEvent,
  )
  const triggerEvent = useEventsStore((state) => state.triggerEvent)

  return () => {
    const event = generateRandomEvent()
    triggerEvent(event)
    return event
  }
}
