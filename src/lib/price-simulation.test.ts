import { describe, expect, it } from 'vitest'

import { calculateNextPrice, getVolatilityBySector } from './price-simulation'

describe('Price Simulation', () => {
  describe('calculateNextPrice', () => {
    it('should return a price close to the current price', () => {
      const currentPrice = 100
      const result = calculateNextPrice(currentPrice)

      // With default volatility, price should typically be within ±10% (accounting for spikes)
      expect(result.price).toBeGreaterThan(0)
      expect(result.price).toBeLessThan(currentPrice * 2) // Sanity check
    })

    it('should always return a price >= $1', () => {
      // Test with a very low starting price
      const currentPrice = 1.5
      // Run multiple times to catch edge cases
      for (let i = 0; i < 100; i++) {
        const result = calculateNextPrice(currentPrice, 2.0)
        expect(result.price).toBeGreaterThanOrEqual(1)
      }
    })

    it('should round price to 2 decimal places', () => {
      const currentPrice = 100
      const result = calculateNextPrice(currentPrice)

      // Check that the price has at most 2 decimal places
      const priceStr = result.price.toString()
      const decimalIndex = priceStr.indexOf('.')
      if (decimalIndex !== -1) {
        const decimalPlaces = priceStr.length - decimalIndex - 1
        expect(decimalPlaces).toBeLessThanOrEqual(2)
      }
      // If no decimal point, that's fine (whole number)
    })

    it('should return change percentage as actual percentage', () => {
      const currentPrice = 100
      const result = calculateNextPrice(currentPrice)

      // changePercent should be in percentage form (e.g., 1.5 not 0.015)
      // Typical range is ±0.75% base + spikes, so usually within ±10%
      expect(result.changePercent).toBeGreaterThan(-100) // Can't lose more than 100%
      expect(result.changePercent).toBeLessThan(100) // Sanity check
    })

    it('should include a timestamp', () => {
      const currentPrice = 100
      const result = calculateNextPrice(currentPrice)

      expect(result.timestamp).toBeInstanceOf(Date)
      expect(result.timestamp.getTime()).toBeLessThanOrEqual(Date.now())
    })

    it('should respect volatility multiplier', () => {
      // Run many simulations with different volatilities
      const lowVolPrices: Array<number> = []
      const highVolPrices: Array<number> = []

      const startPrice = 100

      for (let i = 0; i < 1000; i++) {
        lowVolPrices.push(calculateNextPrice(startPrice, 0.5).price)
        highVolPrices.push(calculateNextPrice(startPrice, 2.0).price)
      }

      // Calculate variance (high volatility should have higher variance)
      const lowVolVariance = calculateVariance(lowVolPrices)
      const highVolVariance = calculateVariance(highVolPrices)

      // High volatility should have noticeably higher variance
      expect(highVolVariance).toBeGreaterThan(lowVolVariance)
    })

    it('should apply event modifier to price change', () => {
      const currentPrice = 100
      const positiveModifier = 0.05 // +5% modifier

      // Run multiple times to get average effect
      const prices: Array<number> = []
      for (let i = 0; i < 100; i++) {
        prices.push(
          calculateNextPrice(currentPrice, 1.0, positiveModifier).price,
        )
      }

      const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length

      // With +5% modifier, average price should be higher than start
      expect(avgPrice).toBeGreaterThan(currentPrice)
    })
  })

  describe('getVolatilityBySector', () => {
    it('should return higher volatility for tech/biotech sectors', () => {
      expect(getVolatilityBySector('Technology')).toBe(1.5)
      expect(getVolatilityBySector('Biotechnology')).toBe(1.6)
    })

    it('should return lower volatility for stable sectors', () => {
      expect(getVolatilityBySector('Heavy Industry')).toBe(0.9)
      expect(getVolatilityBySector('Telecommunications')).toBe(0.8)
    })

    it('should return 1.0 for unknown sectors', () => {
      expect(getVolatilityBySector('Unknown Sector')).toBe(1.0)
      expect(getVolatilityBySector('')).toBe(1.0)
    })

    it('should have volatility values in reasonable range', () => {
      const sectors = [
        'Technology',
        'Consumer Goods',
        'Financial Services',
        'Healthcare',
        'Heavy Industry',
        'Media',
        'Security',
        'Transportation',
        'Energy',
        'Telecommunications',
        'Biotechnology',
        'Military Contractors',
        'Conglomerate',
      ]

      for (const sector of sectors) {
        const volatility = getVolatilityBySector(sector)
        expect(volatility).toBeGreaterThanOrEqual(0.5)
        expect(volatility).toBeLessThanOrEqual(2.0)
      }
    })
  })
})

// Helper function to calculate variance
function calculateVariance(numbers: Array<number>): number {
  const n = numbers.length
  const mean = numbers.reduce((a, b) => a + b, 0) / n
  return numbers.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) / n
}
