import { subDays } from 'date-fns'
import { and, desc, eq, gte, inArray, sql } from 'drizzle-orm'

import { db } from '@/db'
import { companies, stockPrices } from '@/db/schema'

/**
 * Get the latest market date from the database.
 * This is used as the reference point for all date-based queries,
 * making the system year-agnostic - it works based on the data present,
 * not the current calendar date.
 */
export async function getLatestMarketDate(): Promise<Date> {
  const result = await db
    .select({ maxDate: sql<Date | null>`MAX(${stockPrices.timestamp})` })
    .from(stockPrices)

  // If no data, fall back to current date
  const maxDate = result[0]?.maxDate
  return maxDate ?? new Date()
}

export async function getCompanyByName(name: string) {
  const result = await db
    .select({
      id: companies.id,
      name: companies.name,
      ticker: companies.ticker,
      sector: companies.sector,
      description: companies.description,
      logoUrl: companies.logoUrl,
      price: stockPrices.price,
      timestamp: stockPrices.timestamp,
    })
    .from(companies)
    .leftJoin(stockPrices, eq(companies.id, stockPrices.companyId))
    .where(eq(companies.name, name))
    .orderBy(desc(stockPrices.timestamp))
    .limit(1)

  return result[0]
}

export async function getCompanyByTicker(ticker: string) {
  const result = await db
    .select({
      id: companies.id,
      name: companies.name,
      ticker: companies.ticker,
      sector: companies.sector,
      description: companies.description,
      logoUrl: companies.logoUrl,
      price: stockPrices.price,
      timestamp: stockPrices.timestamp,
    })
    .from(companies)
    .leftJoin(stockPrices, eq(companies.id, stockPrices.companyId))
    .where(eq(companies.ticker, ticker))
    .orderBy(desc(stockPrices.timestamp))
    .limit(1)

  return result[0]
}

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
  // Use the latest market date as reference, not current calendar date
  // This makes the system year-agnostic
  const marketDate = await getLatestMarketDate()
  const cutoff = subDays(marketDate, days)

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

export async function get52WeekStatsFromDb(companyId: string) {
  // Use the latest market date as reference, not current calendar date
  const marketDate = await getLatestMarketDate()
  const cutoff = subDays(marketDate, 365)

  const result = await db
    .select({
      high: sql<number>`MAX(${stockPrices.price})`,
      low: sql<number>`MIN(${stockPrices.price})`,
      avgVolume: sql<number>`COUNT(${stockPrices.id})`, // Number of price points as proxy for "volume"
    })
    .from(stockPrices)
    .where(
      and(
        eq(stockPrices.companyId, companyId),
        gte(stockPrices.timestamp, cutoff),
      ),
    )

  return result[0] || { high: 0, low: 0, avgVolume: 0 }
}

export async function getTopMoversFromDb(limit: number = 5) {
  // Fetch prices from the last 7 days to ensure we have at least 2 data points
  // even if there are gaps or weekends (though the seed data is daily)
  // Use the latest market date as reference, not current calendar date
  const marketDate = await getLatestMarketDate()
  const cutoff = subDays(marketDate, 7)

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
