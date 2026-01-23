import { addDays } from 'date-fns'
import { eq } from 'drizzle-orm'

import { companies, stockPrices } from './schema'
import { db } from './index'
import { company_data_seed } from '@/lib/company-data-seed'

// Helper to generate OHLC price history with trends and volatility
// Generates data from January 1 to December 31 of the current year
function generatePriceHistory(startPrice: number) {
  const history: Array<{
    open: number
    high: number
    low: number
    close: number
    timestamp: Date
  }> = []
  let previousClose = startPrice

  // Use current year for the data range (Jan 1 - Dec 31)
  const year = new Date().getFullYear()
  const startDate = new Date(year, 0, 1) // January 1
  const endDate = new Date(year, 11, 31) // December 31

  // Calculate number of days in the year
  const days = Math.floor(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  )

  // Trend parameters
  let currentTrend = 0 // Daily percentage change due to trend
  let trendDuration = 0 // How many days the current trend lasts

  for (let i = 0; i <= days; i++) {
    const date = addDays(startDate, i)

    // Update trend if duration expired
    if (trendDuration <= 0) {
      // New trend: -8% to +8% daily drift
      currentTrend = Math.random() * 0.16 - 0.08
      // Trend lasts 5 to 20 days
      trendDuration = Math.floor(Math.random() * 15) + 5
    }
    trendDuration--

    // Open: Previous close with small gap (-1% to +1%)
    const gapPercent = Math.random() * 0.02 - 0.01
    let open = previousClose * (1 + gapPercent)

    // Simulate intraday price movements (10-20 steps)
    const intradaySteps = Math.floor(Math.random() * 11) + 10
    let currentPrice = open
    let high = open
    let low = open

    for (let step = 0; step < intradaySteps; step++) {
      // Intraday volatility: -5% to +5% per step
      let stepChange = Math.random() * 0.1 - 0.05

      // Add trend influence (smaller per step)
      stepChange += currentTrend / intradaySteps

      // Occasional intraday spike (10% chance)
      if (Math.random() < 0.1) {
        stepChange += Math.random() * 0.1 - 0.05
      }

      currentPrice = currentPrice * (1 + stepChange)

      // Track high and low
      if (currentPrice > high) high = currentPrice
      if (currentPrice < low) low = currentPrice
    }

    // Daily volatility for final close: -10% to +10% from current
    let noise = Math.random() * 0.2 - 0.1

    // Occasional market shock (5% chance)
    if (Math.random() < 0.05) {
      noise += Math.random() * 0.6 - 0.3 // +/- 30% shock
    }

    // Close: Apply final adjustment
    const close = currentPrice * (1 + noise * 0.1)

    // Update high/low to include close
    if (close > high) high = close
    if (close < low) low = close

    // Ensure constraints: high >= max(open, close), low <= min(open, close)
    high = Math.max(high, open, close)
    low = Math.min(low, open, close)

    // Ensure prices don't go below 1
    open = Math.max(open, 1)
    high = Math.max(high, 1)
    low = Math.max(low, 1)
    const finalClose = Math.max(close, 1)

    history.push({
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(finalClose.toFixed(2)),
      timestamp: date,
    })

    previousClose = finalClose
  }
  return history
}

async function seed() {
  console.log('🌱 Seeding database...')

  // Seed Companies
  console.log('Inserting companies...')

  for (const company of company_data_seed) {
    // Generate a ticker if not present (using first 3-4 letters of name)
    const ticker = company.name
      .substring(0, 4)
      .toUpperCase()
      .replace(/[^A-Z]/g, '')

    let companyId: string

    // Check if company exists
    const existing = await db.query.companies.findFirst({
      where: (companiesTable, { eq: eqFn }) =>
        eqFn(companiesTable.name, company.name),
    })

    if (!existing) {
      companyId = crypto.randomUUID()

      await db.insert(companies).values({
        id: companyId,
        name: company.name,
        ticker: ticker,
        sector: company.type[0] || 'Conglomerate',
        description: `A major player in the ${company.type.join(', ')} industry.`,
        logoUrl: 'placeholder.png', // Note: In a real app, we'd upload this or have a proper URL
      })
      console.log(`Created company ${company.name}`)
    } else {
      companyId = existing.id
      console.log(`Company ${company.name} exists. Updating price history...`)
      // Clear existing prices to re-seed with new volatility
      await db.delete(stockPrices).where(eq(stockPrices.companyId, companyId))
    }

    // 2. Seed Stock Prices for this company
    // Generate a random starting price between 50 and 500
    const startPrice = Math.floor(Math.random() * 450) + 50
    const history = generatePriceHistory(startPrice)

    const priceRecords = history.map((h) => ({
      companyId: companyId,
      price: h.close, // Keep for backwards compatibility
      open: h.open,
      high: h.high,
      low: h.low,
      close: h.close,
      timestamp: h.timestamp,
    }))

    // Insert in batches to avoid SQL limits if necessary, but for 365 records it's fine
    await db.insert(stockPrices).values(priceRecords)

    console.log(
      `Seeded ${priceRecords.length} price records for ${company.name} (${ticker}).`,
    )
  }

  console.log('✅ Seeding complete!')
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err)
  process.exit(1)
})
