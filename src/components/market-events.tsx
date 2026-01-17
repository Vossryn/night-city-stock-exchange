import { useEffect, useState } from 'react'
import {
  AlertTriangleIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from 'lucide-react'

import type { MarketEvent } from '@/lib/events-store'

import { useEventsStore } from '@/lib/events-store'

interface EventCardProps {
  event: MarketEvent
}

function EventCard({ event }: EventCardProps) {
  const [remainingTime, setRemainingTime] = useState<number>(0)

  useEffect(() => {
    const updateRemaining = () => {
      const elapsed = Date.now() - event.startTime
      const remaining = Math.max(0, event.duration - elapsed)
      setRemainingTime(remaining)
    }

    updateRemaining()
    const interval = setInterval(updateRemaining, 1000)
    return () => clearInterval(interval)
  }, [event.startTime, event.duration])

  const remainingSeconds = Math.ceil(remainingTime / 1000)
  const progressPercent = (remainingTime / event.duration) * 100

  return (
    <div
      className={`p-3 rounded border ${
        event.isPositive
          ? 'border-green-500/30 bg-green-950/30'
          : 'border-red-500/30 bg-red-950/30'
      }`}
    >
      <div className="flex items-start gap-2">
        <div className="mt-0.5">
          {event.isPositive ? (
            <TrendingUpIcon className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDownIcon className="w-4 h-4 text-red-500" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div
            className={`font-bold text-sm ${event.isPositive ? 'text-green-400' : 'text-red-400'}`}
          >
            {event.title}
          </div>
          <div className="text-xs text-gray-400 mt-0.5 line-clamp-2">
            {event.description}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex flex-wrap gap-1">
              {event.affectedSectors.slice(0, 2).map((sector) => (
                <span
                  key={sector}
                  className="text-xs px-1.5 py-0.5 rounded bg-black/50 text-gray-300"
                >
                  {sector}
                </span>
              ))}
              {event.affectedSectors.length > 2 && (
                <span className="text-xs text-gray-500">
                  +{event.affectedSectors.length - 2}
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500 ml-auto font-mono">
              {remainingSeconds}s
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-2 h-1 bg-black/50 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                event.isPositive ? 'bg-green-500/50' : 'bg-red-500/50'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export function MarketEvents() {
  const activeEvents = useEventsStore((state) => state.activeEvents)
  const eventHistory = useEventsStore((state) => state.eventHistory)

  if (activeEvents.length === 0) {
    return (
      <div className="p-4 border border-cyan-800/50 rounded bg-black/50">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangleIcon className="w-5 h-5 text-cyan-500" />
          <h2 className="text-lg font-semibold text-cyan-500">Market Events</h2>
        </div>
        <div className="text-gray-500 text-sm font-mono text-center py-4">
          NO ACTIVE EVENTS
        </div>
        {eventHistory.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-700">
            <div className="text-xs text-gray-500 mb-2">Recent Events</div>
            <div className="space-y-1">
              {eventHistory.slice(0, 3).map((event) => (
                <div
                  key={event.id}
                  className={`text-xs flex items-center gap-1 ${event.isPositive ? 'text-green-600' : 'text-red-600'}`}
                >
                  {event.isPositive ? (
                    <TrendingUpIcon className="w-3 h-3" />
                  ) : (
                    <TrendingDownIcon className="w-3 h-3" />
                  )}
                  {event.title}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-4 border border-cyan-800/50 rounded bg-black/50">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangleIcon className="w-5 h-5 text-yellow-500 animate-pulse" />
        <h2 className="text-lg font-semibold text-cyan-500">
          Market Events
          <span className="ml-2 text-sm text-yellow-500">
            ({activeEvents.length} active)
          </span>
        </h2>
      </div>
      <div className="space-y-2">
        {activeEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
      {eventHistory.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          <div className="text-xs text-gray-500 mb-2">Recent Events</div>
          <div className="space-y-1">
            {eventHistory.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className={`text-xs flex items-center gap-1 ${event.isPositive ? 'text-green-600' : 'text-red-600'}`}
              >
                {event.isPositive ? (
                  <TrendingUpIcon className="w-3 h-3" />
                ) : (
                  <TrendingDownIcon className="w-3 h-3" />
                )}
                {event.title}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Compact event ticker for showing in navigation or status bar
 */
export function MarketEventsTicker() {
  const activeEvents = useEventsStore((state) => state.activeEvents)

  if (activeEvents.length === 0) {
    return null
  }

  // Show the most recent/impactful event
  const displayEvent = activeEvents[activeEvents.length - 1]

  return (
    <div
      className={`px-3 py-1 rounded text-sm font-mono flex items-center gap-1 ${
        displayEvent.isPositive
          ? 'bg-green-950/50 text-green-400 border border-green-500/30'
          : 'bg-red-950/50 text-red-400 border border-red-500/30'
      }`}
    >
      {displayEvent.isPositive ? (
        <TrendingUpIcon className="w-3 h-3" />
      ) : (
        <TrendingDownIcon className="w-3 h-3" />
      )}
      {displayEvent.title.length > 30
        ? displayEvent.title.slice(0, 30) + '...'
        : displayEvent.title}
    </div>
  )
}
