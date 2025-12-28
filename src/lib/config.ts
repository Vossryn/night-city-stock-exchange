import { z } from 'zod'

const envSchema = z.object({
  VITE_APP_TITLE: z.string().default('Night City Stock Exchange'),
  VITE_INITIAL_CASH: z.coerce.number().default(10000),
  VITE_MARKET_TICK_RATE: z.coerce.number().default(5000),
  VITE_ENABLE_DEBUG_TOOLS: z.coerce.boolean().default(false),
})

const _env = envSchema.safeParse(import.meta.env)

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format())
  throw new Error('Invalid environment variables')
}

export const config = {
  appTitle: _env.data.VITE_APP_TITLE,
  initialCash: _env.data.VITE_INITIAL_CASH,
  marketTickRate: _env.data.VITE_MARKET_TICK_RATE,
  enableDebugTools: _env.data.VITE_ENABLE_DEBUG_TOOLS,
} as const
