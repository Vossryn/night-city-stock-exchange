/**
 * Price simulation utilities for real-time stock price updates.
 * Uses random walk algorithm similar to the seed script but with smaller tick increments.
 */

export interface PriceUpdate {
  price: number
  changePercent: number
  timestamp: Date
}

/**
 * Calculate next price based on current price using random walk algorithm.
 * Mimics volatility from seed script but scaled down for frequent updates (3-5s ticks).
 *
 * @param currentPrice - Current stock price
 * @param volatility - Base volatility multiplier (default: 1.0)
 * @param eventModifier - Additional price modifier from active events (default: 0)
 * @returns Updated price and change percentage
 */
export function calculateNextPrice(
  currentPrice: number,
  volatility: number = 1.0,
  eventModifier: number = 0,
): PriceUpdate {
  // Base volatility: ±0.5% to ±2% per tick (scaled down from seed's daily moves)
  const baseChange = (Math.random() * 0.015 - 0.0075) * volatility

  // Occasional larger moves: 2% chance of ±5% spike
  let spike = 0
  if (Math.random() < 0.02) {
    spike = (Math.random() * 0.1 - 0.05) * volatility
  }

  // Apply event modifier to price change
  const changePercent = baseChange + spike + eventModifier

  let newPrice = currentPrice * (1 + changePercent)

  // Ensure price doesn't go below $1
  if (newPrice < 1) {
    newPrice = 1
  }

  // Round to 2 decimal places
  newPrice = parseFloat(newPrice.toFixed(2))

  return {
    price: newPrice,
    changePercent: changePercent * 100, // Convert to percentage
    timestamp: new Date(),
  }
}

/**
 * Calculate volatility factor based on stock sector.
 * Higher volatility = more dramatic price swings.
 *
 * @param sector - Company sector
 * @returns Volatility multiplier (0.5 to 2.0)
 */
export function getVolatilityBySector(sector: string): number {
  const volatilityMap: Record<string, number> = {
    Technology: 1.5,
    'Consumer Goods': 1.2,
    'Financial Services': 1.3,
    Healthcare: 1.1,
    'Heavy Industry': 0.9,
    Media: 1.4,
    Security: 1.2,
    Transportation: 1.0,
    Energy: 1.3,
    Telecommunications: 0.8,
    Biotechnology: 1.6,
    'Military Contractors': 1.4,
    Conglomerate: 1.0,
  }

  return volatilityMap[sector] || 1.0
}
