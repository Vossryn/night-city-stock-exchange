import { company_data_seed } from '@/lib/company-data-seed';
import { addMinutes, subDays } from 'date-fns';
import { eq } from 'drizzle-orm';
import { db } from './index';
import { companies, stockPrices } from './schema';

// Helper to generate a random walk price history with trends and volatility
function generatePriceHistory(startPrice: number, days: number) {
  const history = [];
  let currentPrice = startPrice;
  const now = new Date();
  const startDate = subDays(now, days);

  // Trend parameters
  let currentTrend = 0; // Daily percentage change due to trend
  let trendDuration = 0; // How many days the current trend lasts

  for (let i = 0; i <= days; i++) {
    const date = addMinutes(startDate, i * 24 * 60); // Add 1 day
    
    // Update trend if duration expired
    if (trendDuration <= 0) {
      // New trend: -4% to +4% daily drift
      currentTrend = (Math.random() * 0.08) - 0.04;
      // Trend lasts 5 to 20 days
      trendDuration = Math.floor(Math.random() * 15) + 5;
    }
    trendDuration--;

    // Daily volatility (noise): -5% to +5%
    let noise = (Math.random() * 0.10) - 0.05;
    
    // Occasional market shock (2% chance)
    if (Math.random() < 0.02) {
       noise += (Math.random() * 0.40) - 0.20; // +/- 20% shock
    }

    // Combined change
    const changePercent = currentTrend + noise;
    
    currentPrice = currentPrice * (1 + changePercent);
    
    // Ensure price doesn't go below 1
    if (currentPrice < 1) currentPrice = 1;

    history.push({
      price: parseFloat(currentPrice.toFixed(2)),
      timestamp: date,
    });
  }
  return history;
}

async function seed() {
  console.log('🌱 Seeding database...');

  // 1. Seed Companies
  console.log('Inserting companies...');
  
  for (const company of company_data_seed) {
    // Generate a ticker if not present (using first 3-4 letters of name)
    const ticker = company.name.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, '');
    
    let companyId: string;

    // Check if company exists
    const existing = await db.query.companies.findFirst({
      where: (companies, { eq }) => eq(companies.name, company.name),
    });

    if (!existing) {
      companyId = crypto.randomUUID();
      
      await db.insert(companies).values({
        id: companyId,
        name: company.name,
        ticker: ticker,
        sector: company.type[0] || 'Conglomerate',
        description: `A major player in the ${company.type.join(', ')} industry.`,
        logoUrl: 'placeholder.png', // Note: In a real app, we'd upload this or have a proper URL
      });
      console.log(`Created company ${company.name}`);
    } else {
      companyId = existing.id;
      console.log(`Company ${company.name} exists. Updating price history...`);
      // Clear existing prices to re-seed with new volatility
      await db.delete(stockPrices).where(eq(stockPrices.companyId, companyId));
    }

    // 2. Seed Stock Prices for this company
    // Generate a random starting price between 50 and 500
    const startPrice = Math.floor(Math.random() * 450) + 50;
    const history = generatePriceHistory(startPrice, 365);

    const priceRecords = history.map(h => ({
      companyId: companyId,
      price: h.price,
      timestamp: h.timestamp,
    }));

    // Insert in batches to avoid SQL limits if necessary, but for 365 records it's fine
    await db.insert(stockPrices).values(priceRecords);
    
    console.log(`Seeded ${priceRecords.length} price records for ${company.name} (${ticker}).`);
  }

  console.log('✅ Seeding complete!');
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
