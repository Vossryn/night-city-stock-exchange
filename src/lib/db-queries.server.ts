import { subDays } from 'date-fns'
import { and, eq, gte, inArray, sql } from 'drizzle-orm'
import { db } from '@/db'
import { companies, stockPrices } from '@/db/schema'

export async function getActiveStocksFromDb() {
  const result = await db
    .select({
      id: companies.id,
      name: companies.name,
      ticker: companies.ticker,
      sector: companies.sector,
      logoUrl: companies.logoUrl,
      price: stockPrices.price,
      timestamp: stockPrices.timestamp,
    })
    .from(companies)
    .leftJoin(stockPrices, eq(companies.id, stockPrices.companyId))
    .where(
      sql`${stockPrices.timestamp} = (
        SELECT MAX(timestamp)
        FROM ${stockPrices}
        WHERE company_id = ${companies.id}
      )`,
    )

  return result
}

export async function getMarketHistoryFromDb(
  days: number,
  companyIds?: Array<string>,
) {
  const cutoff = subDays(new Date(), days)

  const conditions = [gte(stockPrices.timestamp, cutoff)]
  if (companyIds && companyIds.length > 0) {
    conditions.push(inArray(stockPrices.companyId, companyIds))
  }

  const history = await db
    .select({
      companyName: companies.name,
      price: stockPrices.price,
      timestamp: stockPrices.timestamp,
    })
    .from(stockPrices)
    .innerJoin(companies, eq(stockPrices.companyId, companies.id))
    .where(and(...conditions))
    .orderBy(stockPrices.timestamp)

  // Pivot data for Recharts: [{ date: '...', 'Company A': 100, 'Company B': 120 }, ...]
  const pivoted: Array<Record<string, any>> = []
  const dateMap = new Map<string, any>()

  for (const row of history) {
    const dateStr = row.timestamp.toISOString().split('T')[0]
    if (!dateMap.has(dateStr)) {
      const newPoint = { date: dateStr }
      dateMap.set(dateStr, newPoint)
      pivoted.push(newPoint)
    }
    dateMap.get(dateStr)[row.companyName] = row.price
  }

  return pivoted
}

export async function getTopMoversFromDb(limit: number = 5) {
  // Fetch prices from the last 7 days to ensure we have at least 2 data points
  // even if there are gaps or weekends (though the seed data is daily)
  const cutoff = subDays(new Date(), 7)

  const recentPrices = await db
    .select({
      companyId: stockPrices.companyId,
      price: stockPrices.price,
      timestamp: stockPrices.timestamp,
      companyName: companies.name,
      ticker: companies.ticker,
    })
    .from(stockPrices)
    .innerJoin(companies, eq(stockPrices.companyId, companies.id))
    .where(gte(stockPrices.timestamp, cutoff))
    .orderBy(stockPrices.timestamp)

  const companyMap = new Map<
    string,
    {
      prices: Array<{ price: number; timestamp: Date }>
      name: string
      ticker: string
    }
  >()

  for (const record of recentPrices) {
    if (!companyMap.has(record.companyId)) {
      companyMap.set(record.companyId, {
        prices: [],
        name: record.companyName,
        ticker: record.ticker,
      })
    }
    companyMap.get(record.companyId)!.prices.push({
      price: record.price,
      timestamp: record.timestamp,
    })
  }

  const movers = Array.from(companyMap.values())
    .map((c) => {
      // Sort prices by timestamp descending just to be safe
      const sortedPrices = c.prices.sort(
        (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
      )

      if (sortedPrices.length < 2) {
        return {
          name: c.name,
          ticker: c.ticker,
          currentPrice: sortedPrices[0]?.price || 0,
          previousPrice: 0,
          changePercent: 0,
        }
      }

      const current = sortedPrices[0]
      const previous = sortedPrices[1]

      return {
        name: c.name,
        ticker: c.ticker,
        currentPrice: current.price,
        previousPrice: previous.price,
        changePercent:
          ((current.price - previous.price) / previous.price) * 100,
      }
    })
    .sort((a, b) => b.changePercent - a.changePercent) // Descending (Top Gainers)
    .slice(0, limit)

  return movers
}
