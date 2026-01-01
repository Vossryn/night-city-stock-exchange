import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import type { z } from 'zod'

export const companies = sqliteTable('companies', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  ticker: text('ticker').notNull().unique(),
  sector: text('sector').notNull(),
  description: text('description'),
  logoUrl: text('logo_url'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(new Date()),
})

export const stockPrices = sqliteTable('stock_prices', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  companyId: text('company_id')
    .notNull()
    .references(() => companies.id),
  price: real('price').notNull(),
  timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
})

// Zod Schemas
export const insertCompanySchema = createInsertSchema(companies)
export const selectCompanySchema = createSelectSchema(companies)
export const insertStockPriceSchema = createInsertSchema(stockPrices)
export const selectStockPriceSchema = createSelectSchema(stockPrices)

export type Company = z.infer<typeof selectCompanySchema>
export type StockPrice = z.infer<typeof selectStockPriceSchema>
