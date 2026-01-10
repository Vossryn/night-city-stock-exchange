# Project Requirements: Night City Stock Exchange

## 1. Introduction

### 1.1 Purpose

The Night City Stock Exchange (NCSE) is a single-player stock market simulation game set in a futuristic Cyberpunk universe. The application allows users to manage a portfolio, trade shares of fictional mega-corporations, and track their net worth in real-time against a simulated market economy.

### 1.2 Scope

- **In Scope:**
  - Single-player portfolio management.
  - Real-time simulated price updates for a fixed set of companies.
  - Buying and selling mechanics with transaction history.
  - Client-side data persistence (save game).
  - Responsive dashboard with charts and company details.
  - User Authentication (Stateless JWT via GitHub/Google OAuth).
- **Out of Scope:**
  - Multiplayer features or leaderboards (MVP).
  - Real-money transactions.

## 2. User Personas

- **The Edgerunner (Day Trader):** Needs rapid price updates, high-volatility stocks, and quick execution to flip credits fast.
- **The Corp (Long-term Investor):** Looks for stable dividends and steady growth from established mega-corps like Arasaka.
- **The Netrunner (Admin/Dev):** Needs debug tools to manipulate market trends, reset data, and test edge cases.

## 3. Functional Requirements

**Legend:**

- [x] = Fully implemented and functional
- [ ] = Not yet implemented

### 3.1 Dashboard & Overview

- [x] **Market Status:** Display current market status (Open/Closed) and time.
- [x] **Market Movers:** Show top gainer with 7-day performance.
- [x] **Multi-Company Chart:** Interactive chart comparing top 10 companies with timeframe selector.
- [x] **Account Snapshot:**
  - [x] Total Net Worth (Cash + Current Value of Holdings) - Fully integrated with portfolio store.
  - [x] Available Buying Power (Cash Balance) - Displays real cash balance from portfolio.
  - [ ] Daily Profit/Loss (Value and Percentage) - Placeholder, needs daily tracking implementation.

### 3.2 Stock Market Mechanics

- [x] **Price Simulation:** Real-time random walk algorithm with sector-based volatility (0.5x-2.0x multipliers), 2% spike chance, configurable tick interval (1-10 seconds).
- [x] **Trading Engine:**
  - [x] **Buy Orders:**
    - [x] Input: Stock Symbol, Quantity.
    - [x] Validation: Check if User Cash >= (Price \* Quantity).
    - [x] Execution: Deduct cash, add shares to portfolio, update average cost basis.
  - [x] **Sell Orders:**
    - [x] Input: Stock Symbol, Quantity.
    - [x] Validation: Check if User Shares >= Quantity.
    - [x] Execution: Remove shares, add cash to balance.
  - [x] **Order Confirmation:** Displays estimated total cost/payout in real-time before trade execution.
- [x] **Transaction History:** All trades logged with Date/Time, Symbol, Type, Quantity, Price, Total. Viewer UI available at /transactions.

### 3.3 Company Information

- [x] **Company Profile:** Display logo, description, sector (e.g., Arasaka, Militech), and affiliations.
- [x] **Company Detail Page:** Dedicated page per company with full profile and trading panel.
- [x] **Stock Data:**
  - [x] Current Price on detail page with real-time simulated updates.
  - [x] Current Price, Change (%) on market listing cards with up/down/flat indicators.
  - [x] Key Stats: Market Cap, Volume, Day High/Low, 52-Week High/Low.
- [x] **Interactive Charts:**
  - [x] Line charts with 30-day historical data.
  - [x] Multi-company comparison chart on dashboard (timeframes: 1M, 3M, 6M, 12M).
  - [ ] Candlestick charts.
  - [ ] Extended timeframes on detail page: 1D, 1W, 1M, 3M, 1Y, All.
- [ ] **News Feed:** [Optional] Generated news items affecting stock prices.

### 3.4 User Portfolio

- [x] **Holdings List:** Fully functional table displaying for each owned stock:
  - [x] Symbol/Name - Displays ticker and company name.
  - [x] Quantity Owned - Shows shares held.
  - [x] Average Cost Basis - Calculated from purchase history.
  - [x] Current Price - Real-time from simulated market.
  - [x] Current Value (Quantity \* Current Price) - Calculated in real-time.
  - [x] Total Return ($ and %) - Calculated with color-coded indicators.
  - [ ] Day Return ($ and %) - Not implemented, needs daily tracking.
- [ ] **Portfolio Analytics:**
  - [x] Chart placeholders with cyberpunk styling.
  - [ ] Visual breakdown of portfolio allocation (Pie chart by Sector or Company).
  - [ ] Historical Portfolio Value chart with actual data.

### 3.5 Authentication

- [x] **Sign In / Sign Up:**
  - [x] Mock authentication system with character selection (Demo Mode).
  - [x] 6 pre-defined cyberpunk characters: V, Johnny Silverhand, Judy Alvarez, Panam Palmer, River Ward, Takemura.
  - [x] Client-side session management using localStorage.
  - [ ] ~~Support for GitHub OAuth~~ (Deferred - using mock auth for MVP demo).
  - [ ] ~~Support for Google OAuth~~ (Deferred - using mock auth for MVP demo).
- [x] **User Profile:**
  - [x] Display user name in navigation.
  - [x] Logout functionality.
  - [x] Display user avatar from selected character.

## 4. Non-Functional Requirements

### 4.1 Performance

- [ ] Application initial load time should be under 1.5 seconds.
- [x] Market simulation "tick" - Configurable 1-10 seconds (default 4 seconds).
- [ ] UI updates must be smooth (60fps) during price changes.

### 4.2 UI/UX

- [x] **Theme:** Cyberpunk/Dark mode aesthetic (Neon Blue/Pink/Yellow, High Contrast Black backgrounds).
- [x] **Responsiveness:** Fully responsive layout (Mobile-first approach).
- [x] **Terminal Layout:** Immersive CRT/Terminal interface for all pages.
- [ ] **Accessibility:** High contrast text, keyboard navigation support.

### 4.3 Data Persistence

- [x] **Database:** SQLite database with 45+ companies and 365 days of historical price data (seeded).
- [x] **Authentication State:** User session persisted to localStorage via mock auth.
- [x] **Local Storage:** User portfolio data (Holdings, Cash, Transaction History) saved to localStorage, scoped per user.
- [x] **Auto-Save:** Portfolio state auto-saves on every transaction via Zustand persist middleware.

## 5. Tech Stack

- **Frontend:** React 19, TanStack Start (SSR), TypeScript
- **Routing:** TanStack Router (File-based)
- **Database:** SQLite + Drizzle ORM
- **Styling:** Tailwind CSS v4, shadcn/ui (55+ components)
- **State Management:** Zustand with two stores:
  - `market-store.ts` - Real-time price simulation and market status
  - `portfolio-store.ts` - Holdings, cash, transactions with localStorage persistence
- **Authentication:** Mock Auth System (localStorage-based, 6 demo characters)
- **Charts:** Recharts
- **Utilities:** date-fns (Date formatting), lucide-react (Icons), TanStack Query

## 6. MVP Remaining Work

All MVP items have been completed:

- [x] **Transaction History Viewer:** UI to display logged trades at /transactions route.
- [x] **Daily P/L Tracking:** Implemented via daily-snapshot-store.ts.
- [x] **Day Return in Portfolio:** Calculated and displayed per holding in portfolio.
- [x] **User Avatar Display:** Character avatar shown in navigation bar.
- [x] **Key Stock Stats:** Market Cap, Volume, Day High/Low, 52-Week High/Low displayed on company detail page.

## 7. Future Scope / Roadmap

- [ ] **Leaderboards:** Global rankings based on net worth (requires backend).
- [ ] **Events System:** Random events (e.g., "Corporate War", "Data Leak") that drastically affect specific sectors.
- [ ] **Margin Trading:** Ability to borrow money to trade (leverage).
- [ ] **Options Trading:** Calls and Puts for advanced speculation.
- [ ] **Save Import/Export:** Ability to export save string to transfer progress between devices.
- [ ] **Candlestick Charts:** Advanced charting with OHLC data.
- [ ] **Extended Timeframes:** 1D, 1W, 1Y, All historical views.
- [ ] **News Feed:** Generated news affecting stock prices.
