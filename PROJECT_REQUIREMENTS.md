# Project Requirements Document

## Project Overview

This project is a web-based playground simulating a fictional stock exchange set in Night City, the iconic metropolis from Cyberpunk 2077. The platform allows users to experience the thrill of trading virtual stocks tied to corporations, gangs, and assets inspired by the lore of Night City. The goal is to provide an engaging, educational, and entertaining environment for fans of Cyberpunk and finance, featuring dynamic market events, leaderboards, and thematic challenges. The site will emphasize the city's unique blend of opportunity, risk, and corporate intrigue, immersing users in the world of Night City while learning about trading strategies and market dynamics—all with no real money involved.

---

## Functional Requirements

- Users can register, log in, and manage their profiles.
- Users receive a starting balance of virtual currency (eurodollars) to trade.
- Users can buy and sell virtual stocks representing Night City corporations, gangs, and assets.
- Real-time price simulation with dynamic market events inspired by Night City lore (e.g., corporate wars, gang activity, scandals).
- Users can view detailed analytics and historical performance of their portfolio.
- Educational resources and tutorials on trading strategies and market concepts.
- Thematic challenges and special events (e.g., "Arasaka Hostile Takeover Week").
- Responsive design for desktop and mobile devices, with a mobile-first approach.

## Non-Functional Requirements

- The website must load quickly and handle high user concurrency.
- User data and transactions must be securely stored and transmitted (encryption, secure authentication).
- The platform must be highly available and scalable to support growth.
- The user interface should be intuitive, visually engaging, and consistent with Night City’s cyberpunk aesthetic.
- The site must be accessible to users with disabilities (WCAG compliance).
- The system should be robust against common web vulnerabilities (e.g., XSS, CSRF).
- Regular backups and disaster recovery procedures must be in place.
- The site will be built with a mobile-first approach to ensure optimal experience on smartphones and tablets.

## Technical Requirements

Best Practices:

- Use error boundaries and fallback components for robust SSR and client-side error handling.
- Structure routes and server functions for maximum type safety; keep shared types in a common location.
- Prefer modular, composable architecture—adopt only the TanStack Start features needed for each part of the app.
- Use isomorphic loaders and TanStack Query for consistent, cached data fetching and real-time updates.
- Secure all server functions and validate input with Zod schemas.
- Optimize for streaming SSR where possible for best performance and SEO.

Package Manager: npm is used for managing dependencies and scripts across all parts of the project.

Fullstack SSR Framework: TanStack Start is used as the core fullstack React framework, providing:

- Full-document SSR and streaming SSR for fast initial paint and progressive hydration
- Type-safe, modular routing via TanStack Router (file-based and code-based)
- Server Functions (RPCs) for backend logic, database queries, and secure client-server communication
- Isomorphic loaders for seamless data fetching on both server and client
- Integrated state management and caching via TanStack Query
- Error boundaries and fallback components for robust error handling
- Powered by Vite + Nitro for fast development, bundling, and universal deployment

Frontend: React for building the UI, styled with TailwindCSS and Shadcn for modern, customizable components.

Art Style & Color Palette:
The visual design and coloring of the site will be directly influenced by Cyberpunk 2077. The core color palette includes:

- Neon Yellow: #fee801 (primary branding color)
- Electric Blue: #54c1e6
- Cyan: #39c4b6
- Hot Pink / Magenta: #c5003c
- Deep Purple: #880425
- Black: #000000
- Dark Blue: #00060e
- Acid Green: #9a9f17
- White: #f3e600

These colors should be used to evoke the vibrant, neon-lit, and gritty atmosphere of Night City, consistent with the Cyberpunk 2077 aesthetic.

State Management: Zustand for efficient and scalable state management.

Validation: Zod for type-safe schema validation throughout the app.

Routing & App Structure: TanStack Start and TanStack Router for advanced, type-safe routing, SSR, and modular application architecture.

Database: Postgres for persistent storage of user data, transactions, and market history.

ORM: Drizzle ORM for type-safe, modern database access and migrations.
Authentication: Better Auth for secure, robust user authentication and session management.

Data Fetching & State Management:

- Isomorphic loaders: Route-level data loaders run on both server and client, ensuring consistent hydration and fast navigation.
- Server Functions (RPCs): All backend logic (database queries, authentication, external API calls) is implemented as server functions, securely invoked from client or server code.
- TanStack Query: Integrated for advanced caching, background refetching, optimistic updates, and real-time data (WebSocket support for live price updates and market events).

Real-time Features: WebSockets for live price updates and market events, integrated with TanStack Query for seamless state updates.

CI/CD: Automated testing and deployment pipeline.

Hosting & Deployment:

- Universal deployment via Vite + Nitro, supporting Netlify, Vercel, Cloudflare, Node servers, and other cloud platforms.
- Nitro presets allow zero-config deployment to major platforms (set preset in app.config.ts).
- Streaming SSR and server functions are supported on all platforms.
- For Netlify: set build command to `vite build` and publish directory to `dist`.
- For Vercel: set preset to 'vercel' for edge functions and immutable deploys.
- For Cloudflare: use 'cloudflare-pages' or 'cloudflare-module' preset, install `unenv`, and configure `wrangler.toml`.
- For Node servers: set preset to 'node-server' and run the built `.output/server/index.mjs` manually.
- All deployments support SSR, streaming, server functions, and modular routing out of the box.

Thematic UI assets inspired by Night City and Cyberpunk 2077.
API integration for external data (if needed for educational content or news feeds).

## Site Pages & Navigation

Below is an overview of the main pages required for the Night City Stock Exchange platform, including their purpose and key features:

- **Landing / Home Page**

  - Welcome message, branding, and call-to-action.
  - Highlights features, recent market events, and login/register options.

- **Registration & Login Pages**

  - Secure user authentication (register, login, password reset).
  - Social login options (if supported).

- **Dashboard**

  - User’s portfolio summary, balance, recent activity, and quick links.
  - Overview of market status and personal performance.

- **Market / Trading Page**

  - Browse and search all available stocks (corporations, gangs, assets).
  - View real-time prices, charts, and company details.
  - Buy/sell interface for executing trades.

- **Company / Asset Detail Page**

  - Detailed info about a specific company/gang/asset.
  - Price history, description, logo, and related market events.

- **Transaction History Page**

  - List of all user trades and transactions.
  - Filter and search by date, type, asset, etc.

- **Market Events Page**

  - Timeline and details of dynamic market events (e.g., corporate wars, scandals).
  - Impact analysis and links to affected assets.

- **Challenges & Special Events Page**

  - List and details of current and upcoming thematic challenges.
  - Progress tracking and rewards info.

- **Analytics & Performance Page**

  - Advanced portfolio analytics, historical performance, and visualizations.
  - Educational insights and strategy tips.

- **Profile & Settings Page**

  - Manage user info, avatar, password, and notification preferences.
  - GDPR/account deletion and accessibility settings.

- **Help & Tutorials Page**

  - Educational resources, trading tutorials, and FAQ.
  - Contact/support info.

- **Legal & Disclaimer Page**
  - Disclaimers about fictional trading, privacy policy, and terms of service.

Each page should be designed with a mobile-first approach and consistent cyberpunk aesthetic.

## Database Schema (Zod Example)

Below are Zod schema examples for the main database tables required for the Night City Stock Exchange project. These schemas illustrate how entities and relationships are structured for validation and type safety.

```ts
import { z } from "zod";

export const UserSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3).max(32),
  email: z.string().email(),
  passwordHash: z.string(),
  displayName: z.string().max(64),
  avatarUrl: z.string().url().optional(),
  balance: z.number().default(100000), // starting eurodollars
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  isDisabled: z.boolean().default(false),
  lastLoginAt: z.string().datetime().optional(),
});

export const CompanySchema = z.object({
  id: z.string().uuid(),
  name: z.string().max(64),
  type: z.enum(["corporation", "gang", "asset"]),
  description: z.string().max(256),
  logoUrl: z.string().url().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const StockSchema = z.object({
  id: z.string().uuid(),
  companyId: z.string().uuid(),
  ticker: z.string().max(8),
  currentPrice: z.number(),
  marketCap: z.number(),
  outstandingShares: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const TransactionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  stockId: z.string().uuid(),
  type: z.enum(["buy", "sell"]),
  quantity: z.number().int().positive(),
  price: z.number(),
  timestamp: z.string().datetime(),
  eventId: z.string().uuid().optional(),
  status: z.enum(["completed", "pending", "failed"]),
});

export const PortfolioSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  stockId: z.string().uuid(),
  quantity: z.number().int(),
  avgBuyPrice: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const MarketEventSchema = z.object({
  id: z.string().uuid(),
  name: z.string().max(64),
  description: z.string().max(256),
  eventType: z.enum(["corporate_war", "gang_activity", "scandal", "other"]),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  impactDetails: z.record(z.any()),
  createdAt: z.string().datetime(),
});

export const PriceHistorySchema = z.object({
  id: z.string().uuid(),
  stockId: z.string().uuid(),
  price: z.number(),
  timestamp: z.string().datetime(),
});

export const ChallengeSchema = z.object({
  id: z.string().uuid(),
  name: z.string().max(64),
  description: z.string().max(256),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  rewardDetails: z.record(z.any()),
  createdAt: z.string().datetime(),
});

export const UserChallengeSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  challengeId: z.string().uuid(),
  status: z.enum(["active", "completed", "failed"]),
  progress: z.record(z.any()),
  updatedAt: z.string().datetime(),
});
```

## Constraints

- All trading is fictional; no real money or financial advice is provided.

- The platform must not infringe on Cyberpunk 2077 intellectual property beyond fair use for fan projects.
- User data privacy and security must comply with relevant regulations (e.g., GDPR).
- All server functions must validate input and securely handle data, leveraging Zod schemas and TanStack Start SSR best practices.
- SSR and streaming must be used for all major pages to ensure fast initial load, SEO, and accessibility.
- The site must clearly state its entertainment/educational purpose and disclaim any real-world financial implications.
- Thematic consistency with Night City lore must be maintained throughout the user experience.
- No integration with real-world stock exchanges or financial institutions.

## Assumptions

- Users are primarily fans of Cyberpunk 2077, stock trading, or simulation games.
- All market data, corporations, and events are fictional and inspired by Night City lore.
- The platform is intended for entertainment and educational purposes only.
- Users will access the site from a variety of devices and locations.
- The project will not require integration with real financial systems or payment processors.

## Out of Scope

- Real money trading or financial transactions.
- Integration with real-world stock exchanges or financial data providers.
- Providing financial advice or investment recommendations.
- Support for cryptocurrencies or blockchain assets.
- Mobile apps (initial release is web-only; mobile may be considered in future).

## Acceptance Criteria

- Users can register, log in, and trade virtual stocks without errors.
- The platform simulates dynamic market events and updates prices in real time.
- SSR and streaming SSR are used for all major pages, ensuring fast initial load and SEO.
- All server functions validate input and securely handle data.
- The user interface is visually consistent with Night City’s cyberpunk theme and is responsive across devices.
- All user data is securely stored and managed.
- The site displays clear disclaimers about its fictional and educational nature.
- The platform passes usability, accessibility, and security tests.

## Future Considerations

- Development of mobile apps for iOS and Android.
- Expansion of virtual assets to include real estate, commodities, or cyberware.
- Integration of social features (chat, forums, user groups).
- Advanced analytics and AI-driven market simulation.
- Seasonal events and content updates tied to Cyberpunk 2077 lore.
- Localization for international audiences.
- Partnerships with fan communities or official Cyberpunk 2077 channels (if permitted).

_Fill in each section as needed to define your project requirements._
