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
- **Out of Scope:**
    - Multiplayer features or leaderboards (MVP).
    - Real-money transactions.
    - Backend server integration (Client-side only logic for MVP).
    - User authentication (Local device only).

## 2. User Personas
- **The Edgerunner (Day Trader):** Needs rapid price updates, high-volatility stocks, and quick execution to flip credits fast.
- **The Corp (Long-term Investor):** Looks for stable dividends and steady growth from established mega-corps like Arasaka.
- **The Netrunner (Admin/Dev):** Needs debug tools to manipulate market trends, reset data, and test edge cases.

## 3. Functional Requirements

### 3.1 Dashboard & Overview
- [ ] **Market Status:** Display current market status (Open/Closed) and time.
- [ ] **Market Movers:** Show top gainers, losers, and most active stocks by volume.
- [ ] **Account Snapshot:**
    - [ ] Total Net Worth (Cash + Current Value of Holdings).
    - [ ] Available Buying Power (Cash Balance).
    - [ ] Daily Profit/Loss (Value and Percentage).

### 3.2 Stock Market Mechanics
- [ ] **Price Simulation:** Prices update in real-time based on simulated market activity or random walk algorithms.
- [ ] **Trading Engine:**
    - [ ] **Buy Orders:**
        - [ ] Input: Stock Symbol, Quantity.
        - [ ] Validation: Check if User Cash >= (Price * Quantity).
        - [ ] Execution: Deduct cash, add shares to portfolio.
    - [ ] **Sell Orders:**
        - [ ] Input: Stock Symbol, Quantity.
        - [ ] Validation: Check if User Shares >= Quantity.
        - [ ] Execution: Remove shares, add cash to balance.
    - [ ] **Order Confirmation:** Display estimated total cost/payout before confirming.
- [ ] **Transaction History:** Log every trade with: Date/Time, Symbol, Type (Buy/Sell), Quantity, Price per Share, Total Value.

### 3.3 Company Information
- [ ] **Company Profile:** Display logo, description, sector (e.g., Arasaka, Militech), and CEO.
- [ ] **Stock Data:**
    - [ ] Current Price, Change ($), Change (%).
    - [ ] Key Stats: Market Cap, Volume, Day High/Low, 52-Week High/Low.
- [ ] **Interactive Charts:**
    - [ ] Line/Candlestick charts.
    - [ ] Timeframes: 1D, 1W, 1M, 3M, 1Y, All.
- [ ] **News Feed:** [Optional] Generated news items affecting stock prices.

### 3.4 User Portfolio
- [ ] **Holdings List:** Table displaying for each owned stock:
    - [ ] Symbol/Name.
    - [ ] Quantity Owned.
    - [ ] Average Cost Basis.
    - [ ] Current Price.
    - [ ] Current Value (Quantity * Current Price).
    - [ ] Total Return ($ and %).
    - [ ] Day Return ($ and %).
- [ ] **Portfolio Analytics:**
    - [ ] Visual breakdown of portfolio allocation (Pie chart by Sector or Company).
    - [ ] Historical Portfolio Value chart.

## 4. Non-Functional Requirements

### 4.1 Performance
- [ ] Application initial load time should be under 1.5 seconds.
- [ ] Market simulation "tick" should occur every 3-5 seconds.
- [ ] UI updates must be smooth (60fps) during price changes.

### 4.2 UI/UX
- [ ] **Theme:** Cyberpunk/Dark mode aesthetic (Neon Blue/Pink/Yellow, High Contrast Black backgrounds).
- [ ] **Responsiveness:** Fully responsive layout (Mobile-first approach).
- [ ] **Accessibility:** High contrast text, keyboard navigation support.

### 4.3 Data Persistence
- [ ] **Local Storage:** All user data (Portfolio, Cash, Transaction History) and Market State must be saved to the browser's `localStorage`.
- [ ] **Auto-Save:** Game state should auto-save on every transaction and periodically (e.g., every 30 seconds).

## 5. Tech Stack
- **Frontend:** React 19, Vite, TypeScript
- **Routing:** TanStack Router
- **Styling:** Tailwind CSS v4, shadcn/ui
- **State Management:** React Context API + Custom Hooks
- **Charts:** Recharts
- **Utilities:** date-fns (Date formatting), lucide-react (Icons)

## 6. Future Scope / Roadmap
- [ ] **Leaderboards:** Global rankings based on net worth (requires backend).
- [ ] **Events System:** Random events (e.g., "Corporate War", "Data Leak") that drastically affect specific sectors.
- [ ] **Margin Trading:** Ability to borrow money to trade (leverage).
- [ ] **Options Trading:** Calls and Puts for advanced speculation.
- [ ] **Save Import/Export:** Ability to export save string to transfer progress between devices.
