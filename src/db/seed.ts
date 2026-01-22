import { addDays } from 'date-fns'
import { eq } from 'drizzle-orm'

import { companies, stockPrices } from './schema'
import { db } from './index'
import { company_data_seed } from '@/lib/company-data-seed'

// Helper to generate a random walk price history with trends and volatility
// Generates data from January 1 to December 31 of the current year
function generatePriceHistory(startPrice: number) {
  const history = []
  let currentPrice = startPrice

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

    // Daily volatility (noise): -10% to +10%
    let noise = Math.random() * 0.2 - 0.1

    // Occasional market shock (5% chance)
    if (Math.random() < 0.05) {
      noise += Math.random() * 0.6 - 0.3 // +/- 30% shock
    }

    // Combined change
    const changePercent = currentTrend + noise

    currentPrice = currentPrice * (1 + changePercent)

    // Ensure price doesn't go below 1
    if (currentPrice < 1) currentPrice = 1

    history.push({
      price: parseFloat(currentPrice.toFixed(2)),
      timestamp: date,
    })
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
      price: h.price,
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
