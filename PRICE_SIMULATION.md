# Real-Time Price Simulation System

## Overview

The Night City Stock Exchange now features a real-time price simulation system that updates stock prices every 3-5 seconds while the market is open. This creates a dynamic, engaging trading environment where prices fluctuate based on random walk algorithms with sector-specific volatility.

## Architecture

### Core Components

#### 1. Price Simulation Logic (`src/lib/price-simulation.ts`)

The price simulation module provides core algorithms for generating realistic price movements:

- **`calculateNextPrice(currentPrice, volatility)`**: Generates the next price tick using random walk
  - Base volatility: ±0.5% to ±2% per tick
  - Occasional spikes: 2% chance of ±5% movement
  - Minimum price floor: $1.00

- **`getVolatilityBySector(sector)`**: Returns sector-specific volatility multipliers (0.5x to 2.0x)
  - High volatility: Biotechnology (1.6x), Technology (1.5x), Media (1.4x)
  - Low volatility: Telecommunications (0.8x), Heavy Industry (0.9x)

#### 2. Market Store (`src/lib/market-store.ts`)

Zustand-based state management for the simulation:

**State:**

- `status`: Market status (OPEN/CLOSED)
- `tickInterval`: Milliseconds between updates (default: 4000ms)
- `stocks`: Map of all simulated stock data
- `isInitialized`: Whether the store has loaded data
- `lastTickTime`: Timestamp of last price update

**Key Actions:**

- `initializeStocks(stockData)`: Load initial prices from database
- `updatePrices()`: Calculate and apply new prices to all stocks
- `setMarketStatus(status)`: Toggle market OPEN/CLOSED
- `getStockByTicker(ticker)`: Retrieve specific stock data
- `getAllStocks()`: Get all stocks as array

**SimulatedStock Interface:**

```typescript
{
  id: string
  ticker: string
  name: string
  sector: string
  currentPrice: number
  previousPrice: number
  changePercent: number // Current tick change %
  lastUpdate: Date
  volatility: number // Sector multiplier
}
```

#### 3. Market Simulation Hook (`src/hooks/useMarketSimulation.ts`)

React hook that manages the simulation lifecycle:

1. Fetches initial stock prices from database via `useGetActiveStocks()`
2. Initializes market store with database data
3. Sets up interval to call `updatePrices()` every 4 seconds
4. Automatically pauses when market status is CLOSED
5. Cleans up interval on unmount

**Usage:**

```typescript
// In root component
useMarketSimulation() // Starts simulation for entire app
```

#### 4. Simulated Stocks Hooks (`src/hooks/useSimulatedStocks.ts`)

Convenience hooks for accessing simulated data in components:

- `useSimulatedStocks()`: Get all stocks (reactive)
- `useSimulatedStock(ticker)`: Get specific stock by ticker
- `useSimulatedStockById(id)`: Get specific stock by ID
- `useMarketStats()`: Get market-wide statistics (gainers, losers, average change)

### UI Components

#### Market Controls (`src/components/market-controls.tsx`)

Interactive control panel for the simulation:

- Displays market status with animated indicator
- Shows last update timestamp
- Pause/Resume button to toggle market status
- Only visible when simulation is initialized

#### Updated Components

**Dashboard** (`src/features/dashboard.tsx`):

- Shows real-time market status (OPEN/CLOSED)
- Displays gainers/losers count
- Top mover updates with simulated prices
- Market controls integrated

**Market Listing** (`src/features/market-listing.tsx`):

- Each company card shows live price
- Change percentage with colored indicators
- Updates every tick

**Company Detail** (`src/features/company-detail.tsx`):

- Current price displays simulated value
- Shows tick-by-tick change percentage
- Trading uses live simulated prices

## Data Flow

```
Database (historical prices)
    ↓
useGetActiveStocks() hook
    ↓
useMarketSimulation() initializes market store
    ↓
Interval timer (every 4s)
    ↓
updatePrices() calculates new prices
    ↓
Market store updates
    ↓
Components re-render with new prices
```

## Integration Points

### Initialization

The simulation is initialized in the root component (`src/routes/__root.tsx`):

```typescript
function RootComponent() {
  // Initialize market simulation (runs throughout the app)
  useMarketSimulation()

  return (
    <QueryClientProvider client={queryClient}>
      {/* App content */}
    </QueryClientProvider>
  )
}
```

### Using Simulated Prices in Components

```typescript
import { useSimulatedStocks } from '@/hooks/useSimulatedStocks'
import { useMarketStore } from '@/lib/market-store'

function MyComponent() {
  const stocks = useSimulatedStocks()
  const isInitialized = useMarketStore((state) => state.isInitialized)

  // Always check isInitialized before using simulated data
  if (!isInitialized) {
    return <LoadingState />
  }

  return (
    <div>
      {stocks.map(stock => (
        <div key={stock.id}>
          {stock.name}: ${stock.currentPrice.toFixed(2)}
          <span className={stock.changePercent > 0 ? 'text-green' : 'text-red'}>
            {stock.changePercent.toFixed(2)}%
          </span>
        </div>
      ))}
    </div>
  )
}
```

### Portfolio Integration

The simulation works seamlessly with the portfolio system:

```typescript
// Dashboard calculates net worth using simulated prices
const currentPrices = simulatedStocks.reduce(
  (acc, stock) => {
    acc[stock.ticker] = stock.currentPrice
    return acc
  },
  {} as Record<string, number>,
)

const netWorth = getTotalValue(currentPrices)
```

## Configuration

### Tick Interval

Default: 4000ms (4 seconds)

Change via market store:

```typescript
const setTickInterval = useMarketStore((state) => state.setTickInterval)
setTickInterval(5000) // 5 seconds
```

### Volatility Tuning

Edit sector volatilities in `src/lib/price-simulation.ts`:

```typescript
const volatilityMap: Record<string, number> = {
  Technology: 1.5, // 50% more volatile
  Healthcare: 1.1, // 10% more volatile
  // etc.
}
```

Adjust base tick volatility by changing the multipliers in `calculateNextPrice()`.

## Future Enhancements

### Planned Features

1. **Persistence**: Save simulated prices to database periodically
2. **Historical Tracking**: Build price history from simulation ticks
3. **Market Events**: Random events that affect entire sectors
4. **Trading Volume**: Simulate market activity levels
5. **Market Hours**: Auto-open/close based on time of day
6. **Speed Controls**: Fast-forward/slow-motion simulation

### Potential Optimizations

1. **Web Workers**: Move price calculations to background thread
2. **Incremental Updates**: Only update visible stocks
3. **Price Compression**: Store tick history more efficiently
4. **Server-Side Simulation**: Run simulation on server for multiplayer

## Testing

### Manual Testing Checklist

- [ ] Market initializes on app load
- [ ] Prices update every 3-5 seconds when OPEN
- [ ] Prices stop updating when CLOSED
- [ ] Pause/Resume button toggles market status
- [ ] Dashboard shows correct top mover
- [ ] Market listing shows live prices
- [ ] Company detail page uses simulated prices for trades
- [ ] Portfolio net worth updates with price changes
- [ ] Market stats (gainers/losers) calculate correctly

### Debug Tools

Enable TanStack devtools to inspect market store state in real-time.

## Performance Notes

- **Memory**: ~1KB per stock (45 stocks = ~45KB total)
- **CPU**: Minimal - calculations run once every 4 seconds
- **Reactivity**: Zustand provides efficient updates (only changed values trigger re-renders)

## Requirements Checklist

- [x] Market simulation tick occurs every 3-5 seconds
- [x] Prices update based on random walk algorithms
- [x] Similar volatility to seed script (scaled for ticks)
- [x] Market has Open/Closed status
- [x] Market status displayed on dashboard
- [x] Minimum price floor ($1) enforced
- [x] Sector-specific volatility
- [x] Real-time UI updates
- [x] Pause/Resume controls
- [x] Integration with trading system
- [x] Integration with portfolio valuation

## Known Limitations

1. **No Persistence**: Simulated prices are lost on page refresh (reverts to database)
2. **Single User**: State is client-side only (not synced across tabs/devices)
3. **No Historical Chart**: Charts still show database data, not live simulation
4. **Fixed Interval**: Currently hardcoded to 4s (configurable but not via UI)

## Migration Notes

The simulation is designed to be **non-destructive**:

- Original database prices remain unchanged
- Simulated prices exist only in browser memory
- Components fall back to database prices if simulation not initialized
- Can be disabled by removing `useMarketSimulation()` from root component
