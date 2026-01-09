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
- [x] with note = UI/structure complete, needs integration/data
- [ ] = Not yet implemented

### 3.1 Dashboard & Overview

- [x] **Market Status:** Display current market status (Open/Closed) and time.
- [x] **Market Movers:** Show top gainer with 7-day performance.
- [x] **Multi-Company Chart:** Interactive chart comparing top 10 companies with timeframe selector.
- [x] **Account Snapshot UI:**
  - [x] Total Net Worth (Cash + Current Value of Holdings) - Shows $0.00 placeholder.
  - [x] Available Buying Power (Cash Balance) - Shows $0.00 placeholder.
  - [x] Daily Profit/Loss (Value and Percentage) - Shows $0.00 placeholder.
  - [ ] **Status:** UI complete, needs integration with portfolio state management.

### 3.2 Stock Market Mechanics

- [ ] **Price Simulation:** Prices update in real-time based on simulated market activity or random walk algorithms.
- [ ] **Trading Engine:**
  - [ ] **Buy Orders:**
    - [ ] Input: Stock Symbol, Quantity.
    - [ ] Validation: Check if User Cash >= (Price \* Quantity).
    - [ ] Execution: Deduct cash, add shares to portfolio.
  - [ ] **Sell Orders:**
    - [ ] Input: Stock Symbol, Quantity.
    - [ ] Validation: Check if User Shares >= Quantity.
    - [ ] Execution: Remove shares, add cash to balance.
  - [ ] **Order Confirmation:** Display estimated total cost/payout before confirming.
- [ ] **Transaction History:** Log every trade with: Date/Time, Symbol, Type (Buy/Sell), Quantity, Price per Share, Total Value.

### 3.3 Company Information

- [x] **Company Profile:** Display logo, description, sector (e.g., Arasaka, Militech), and affiliations.
- [x] **Company Detail Page:** Dedicated page per company with full profile and trading panel.
- [ ] **Stock Data:**
  - [x] Current Price on detail page.
  - [ ] Current Price, Change ($), Change (%) on market listing cards.
  - [ ] Key Stats: Market Cap, Volume, Day High/Low, 52-Week High/Low.
- [x] **Interactive Charts:**
  - [x] Line charts with 30-day historical data.
  - [x] Multi-company comparison chart on dashboard (timeframes: 1M, 3M, 6M, 12M).
  - [ ] Candlestick charts.
  - [ ] Extended timeframes on detail page: 1D, 1W, 1M, 3M, 1Y, All.
- [ ] **News Feed:** [Optional] Generated news items affecting stock prices.

### 3.4 User Portfolio

- [x] **Holdings List UI:** Table structure displaying for each owned stock:
  - [ ] Symbol/Name (structure exists, no data).
  - [ ] Quantity Owned.
  - [ ] Average Cost Basis.
  - [ ] Current Price.
  - [ ] Current Value (Quantity \* Current Price).
  - [ ] Total Return ($ and %).
  - [ ] Day Return ($ and %).
  - [ ] **Status:** UI complete, needs state management and data integration.
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
  - [ ] Display user avatar from selected character.

## 4. Non-Functional Requirements

### 4.1 Performance

- [ ] Application initial load time should be under 1.5 seconds.
- [ ] Market simulation "tick" should occur every 3-5 seconds.
- [ ] UI updates must be smooth (60fps) during price changes.

### 4.2 UI/UX

- [x] **Theme:** Cyberpunk/Dark mode aesthetic (Neon Blue/Pink/Yellow, High Contrast Black backgrounds).
- [x] **Responsiveness:** Fully responsive layout (Mobile-first approach).
- [x] **Terminal Layout:** Immersive CRT/Terminal interface for all pages.
- [ ] **Accessibility:** High contrast text, keyboard navigation support.

### 4.3 Data Persistence

- [x] **Database:** SQLite database with 45+ companies and 365 days of historical price data (seeded).
- [x] **Authentication State:** User session persisted to localStorage via mock auth.
- [ ] **Local Storage:** User portfolio data (Holdings, Cash, Transaction History) must be saved to `localStorage`.
- [ ] **Auto-Save:** Game state should auto-save on every transaction and periodically (e.g., every 30 seconds).

## 5. Tech Stack

- **Frontend:** React 19, TanStack Start (SSR), TypeScript
- **Routing:** TanStack Router (File-based)
- **Database:** SQLite + Drizzle ORM
- **Styling:** Tailwind CSS v4, shadcn/ui (45+ components)
- **State Management:** Zustand (installed, not yet implemented)
- **Authentication:** Mock Auth System (localStorage-based, 6 demo characters)
- **Charts:** Recharts
- **Utilities:** date-fns (Date formatting), lucide-react (Icons), TanStack Query

## 6. Future Scope / Roadmap

- [ ] **Leaderboards:** Global rankings based on net worth (requires backend).
- [ ] **Events System:** Random events (e.g., "Corporate War", "Data Leak") that drastically affect specific sectors.
- [ ] **Margin Trading:** Ability to borrow money to trade (leverage).
- [ ] **Options Trading:** Calls and Puts for advanced speculation.
- [ ] **Save Import/Export:** Ability to export save string to transfer progress between devices.
