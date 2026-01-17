/**
 * Events Store - Manages random market events
 * Events affect stock prices based on their sector and impact range
 */

import { create } from 'zustand'

import {
  EVENT_TEMPLATES,
  getRandomElement,
  getRandomEventType,
  getRandomInRange,
} from './event-templates'
import type { EventType } from './event-templates'

export interface MarketEvent {
  id: string
  type: EventType
  title: string
  description: string
  affectedSectors: Array<string>
  priceImpact: number // Per-tick impact percentage
  duration: number // Duration in milliseconds
  startTime: number // Timestamp when event started
  isActive: boolean
  isPositive: boolean
}

interface EventsState {
  activeEvents: Array<MarketEvent>
  eventHistory: Array<MarketEvent>
  maxHistorySize: number

  // Actions
  triggerEvent: (event: MarketEvent) => void
  deactivateEvent: (eventId: string) => void
  generateRandomEvent: () => MarketEvent
  getActiveEventsForSector: (sector: string) => Array<MarketEvent>
  getEventModifier: (sector: string) => number
  cleanupExpiredEvents: () => void
  clearAllEvents: () => void
}

/**
 * Generate a unique ID for events
 */
function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

export const useEventsStore = create<EventsState>((set, get) => ({
  activeEvents: [],
  eventHistory: [],
  maxHistorySize: 20,

  /**
   * Trigger a new market event
   */
  triggerEvent: (event: MarketEvent) => {
    set((state) => ({
      activeEvents: [...state.activeEvents, event],
    }))

    // Schedule automatic deactivation
    setTimeout(() => {
      get().deactivateEvent(event.id)
    }, event.duration)
  },

  /**
   * Deactivate an event (move to history)
   */
  deactivateEvent: (eventId: string) => {
    set((state) => {
      const event = state.activeEvents.find((e) => e.id === eventId)
      if (!event) return state

      const deactivatedEvent = { ...event, isActive: false }
      const newHistory = [deactivatedEvent, ...state.eventHistory].slice(
        0,
        state.maxHistorySize,
      )

      return {
        activeEvents: state.activeEvents.filter((e) => e.id !== eventId),
        eventHistory: newHistory,
      }
    })
  },

  /**
   * Generate a random market event
   */
  generateRandomEvent: (): MarketEvent => {
    const eventType = getRandomEventType()
    const template = EVENT_TEMPLATES[eventType]

    const [minImpact, maxImpact] = template.impactRange
    const [minDuration, maxDuration] = template.durationRange

    return {
      id: generateEventId(),
      type: eventType,
      title: getRandomElement(template.titles),
      description: getRandomElement(template.descriptions),
      affectedSectors: [...template.affectedSectors],
      priceImpact: getRandomInRange(minImpact, maxImpact),
      duration: Math.round(getRandomInRange(minDuration, maxDuration)),
      startTime: Date.now(),
      isActive: true,
      isPositive: template.isPositive,
    }
  },

  /**
   * Get all active events that affect a specific sector
   */
  getActiveEventsForSector: (sector: string): Array<MarketEvent> => {
    return get().activeEvents.filter((event) =>
      event.affectedSectors.includes(sector),
    )
  },

  /**
   * Calculate the combined price modifier for a sector from all active events
   * Returns the sum of all event impacts affecting this sector
   */
  getEventModifier: (sector: string): number => {
    const events = get().getActiveEventsForSector(sector)
    return events.reduce((sum, event) => sum + event.priceImpact, 0)
  },

  /**
   * Clean up any events that have exceeded their duration
   * Called periodically as a safety measure
   */
  cleanupExpiredEvents: () => {
    const now = Date.now()
    set((state) => {
      const expired = state.activeEvents.filter(
        (event) => now - event.startTime > event.duration,
      )
      const stillActive = state.activeEvents.filter(
        (event) => now - event.startTime <= event.duration,
      )

      const expiredWithStatus = expired.map((e) => ({ ...e, isActive: false }))
      const newHistory = [...expiredWithStatus, ...state.eventHistory].slice(
        0,
        state.maxHistorySize,
      )

      return {
        activeEvents: stillActive,
        eventHistory: newHistory,
      }
    })
  },

  /**
   * Clear all active events (for testing/reset)
   */
  clearAllEvents: () => {
    set({ activeEvents: [], eventHistory: [] })
  },
}))
