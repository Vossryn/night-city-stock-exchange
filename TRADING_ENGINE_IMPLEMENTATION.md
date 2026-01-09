# Trading Engine Implementation

## Overview

This document describes the implementation of the trading functionality for the Night City Stock Exchange application.

## Files Created/Modified

### Created Files

1. **`src/lib/portfolio-store.ts`** - Portfolio state management
   - Manages user cash balance, holdings, and transaction history
   - Uses Zustand with localStorage persistence
   - Scoped per user ID for multi-user support
   - Exports helper functions for formatting and calculations

### Modified Files

1. **`src/features/company-detail.tsx`** - Trading UI
   - Added quantity input field
   - Implemented BUY/SELL button handlers
   - Integrated portfolio store for balance/holdings checks
   - Added validation for buy/sell operations
   - Displays user's current holdings and available cash
   - Shows estimated total before trade execution
   - Toast notifications for success/error states

2. **`src/features/dashboard.tsx`** - Portfolio summary
   - Displays net worth (cash + holdings value)
   - Shows available buying power
   - Calculates total value from simulated prices

3. **`src/features/portfolio.tsx`** - Portfolio details
   - Complete portfolio overview with holdings table
   - Shows per-position metrics (quantity, avg cost, current value, returns)
   - Calculates total invested and total returns
   - Color-coded gains/losses

4. **`src/routes/__root.tsx`** - User session management
   - Added Toaster component for toast notifications
   - Initializes user portfolio on app mount

5. **`src/features/login.tsx`** - Portfolio initialization
   - Loads user-specific portfolio on login

## Trading Features

### Buy Flow

1. User selects quantity of shares to buy
2. System calculates estimated total (price × quantity)
3. Validates user has sufficient cash
4. On confirmation:
   - Deducts cash from balance
   - Adds/updates position (recalculates average cost)
   - Creates transaction record
   - Shows success toast
   - Refreshes data

### Sell Flow

1. User selects quantity of shares to sell
2. System calculates estimated proceeds
3. Validates user has sufficient shares
4. On confirmation:
   - Adds cash to balance
   - Reduces/removes position
   - Creates transaction record
   - Shows success toast
   - Refreshes data

### Validation

- **Buy orders**: Checks `cash >= price * quantity`
- **Sell orders**: Checks `holdings[ticker] >= quantity`
- Input validation: Only positive integers allowed
- Real-time feedback on validation errors

### Portfolio Tracking

- **Holdings**: Tracks quantity and average cost per position
- **Transactions**: Complete audit trail of all trades
- **Net Worth**: Cash + sum of (holdings × current prices)
- **Returns**: Calculated as (current value - cost basis) / cost basis

## State Management

### Portfolio Store Structure

```typescript
interface PortfolioState {
  userId: string | null
  cashBalance: number
  holdings: Record<string, Holding>
  transactions: Array<Transaction>
  buyStock: (symbol: string, quantity: number, price: number) => boolean
  sellStock: (symbol: string, quantity: number, price: number) => boolean
  getHolding: (symbol: string) => Holding | undefined
  getTotalPortfolioValue: (currentPrices: Record<string, number>) => number
  resetPortfolio: () => void
  loadUserPortfolio: (userId: string) => void
  clearPortfolio: () => void
}
```

### Starting Balance

- All users start with **$100,000** in cash
- Persisted per user in localStorage with key `ncse-portfolio-{userId}`

## User Interface

### Company Detail Page

- **Current Price**: Shows live price with change indicator
- **Available Cash**: User's current buying power
- **Your Holdings**: Shares owned for this stock (if any)
- **Quantity Input**: Number field for trade amount
- **Estimated Total**: Real-time calculation of trade value
- **BUY Button**: Enabled when user has sufficient cash
- **SELL Button**: Enabled when user has sufficient shares
- **Processing State**: Buttons disabled during trade execution

### Dashboard

- **Account Snapshot**: Net worth and buying power
- Portfolio value updates in real-time with market prices

### Portfolio Page

- **Summary Cards**:
  - Net Worth (total value)
  - Total Invested (cost basis)
  - Total Return ($ and %)
- **Holdings Table**: All positions with:
  - Symbol & company name
  - Quantity owned
  - Average cost
  - Current price
  - Total value
  - Gain/loss with percentage

## Error Handling

- Toast notifications for all errors
- Validation errors displayed inline
- Failed trades roll back state
- Graceful handling of missing data

## Integration Points

1. **Market Simulation**: Uses real-time simulated prices from `useSimulatedStocks`
2. **React Query**: Invalidates queries after trades to refresh UI
3. **Mock Auth**: Portfolio scoped to logged-in user
4. **Toast System**: sonner library for notifications

## Future Enhancements

Potential improvements for the trading engine:

1. **Order Types**: Limit orders, stop-loss orders
2. **Trading History**: Detailed transaction log page
3. **Performance Analytics**: Charts showing portfolio performance over time
4. **Position Details**: Drill-down view for individual holdings
5. **Trade Confirmation Modal**: Confirmation dialog before executing trades
6. **Fractional Shares**: Support for buying partial shares
7. **Watchlist**: Save stocks for quick access
8. **Alerts**: Price alerts for specific stocks

## Testing

To test the trading functionality:

1. Log in as any demo user
2. Navigate to Market page
3. Click on a company to view details
4. Enter a quantity and click BUY
5. Verify cash deduction and position creation in Portfolio
6. Return to company and SELL shares
7. Verify cash addition and position update
8. Check Dashboard for updated net worth
9. Log out and log in as different user
10. Verify separate portfolio state

## Code Quality

- TypeScript for type safety
- Follows project's ESLint rules
- Consistent with codebase patterns:
  - Route/feature separation
  - Zustand for state management
  - React Query for data fetching
  - Proper import ordering
