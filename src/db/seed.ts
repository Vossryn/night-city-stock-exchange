import { db } from './index';
import { companies, stockPrices } from './schema';
import { company_data_seed } from '@/lib/company-data-seed';
import { subDays, addMinutes } from 'date-fns';

// Helper to generate a random walk price history
function generatePriceHistory(startPrice: number, days: number) {
  const history = [];
  let currentPrice = startPrice;
  const now = new Date();
  const startDate = subDays(now, days);

  // Generate one price point per hour for the last year (approx)
  // For simplicity in this seed, let's do 1 point per day to keep DB size manageable for MVP
  // Or maybe 4 points per day (Open, Close, High, Low approximation)
  
  // Let's do daily close prices for the last 365 days
  for (let i = 0; i <= days; i++) {
    const date = addMinutes(startDate, i * 24 * 60); // Add 1 day
    
    // Random walk: price changes by -5% to +5%
    const changePercent = (Math.random() * 0.10) - 0.05; 
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
    
    // Check if company exists
    const existing = await db.query.companies.findFirst({
      where: (companies, { eq }) => eq(companies.name, company.name),
    });

    if (!existing) {
      const companyId = crypto.randomUUID();
      
      await db.insert(companies).values({
        id: companyId,
        name: company.name,
        ticker: ticker,
        sector: company.type[0] || 'Conglomerate',
        description: `A major player in the ${company.type.join(', ')} industry.`,
        logoUrl: 'placeholder.png', // Note: In a real app, we'd upload this or have a proper URL
      });

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
      
      console.log(`Created ${company.name} (${ticker}) with ${priceRecords.length} price records.`);
    } else {
      console.log(`Skipping ${company.name}, already exists.`);
    }
  }

  console.log('✅ Seeding complete!');
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
