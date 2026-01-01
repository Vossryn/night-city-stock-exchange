import { z } from 'zod'

// Client-side environment variables
const clientEnvSchema = z.object({
  VITE_APP_TITLE: z.string().default('Night City Stock Exchange'),
  VITE_INITIAL_CASH: z.coerce.number().default(10000),
  VITE_MARKET_TICK_RATE: z.coerce.number().default(5000),
  VITE_ENABLE_DEBUG_TOOLS: z.coerce.boolean().default(false),
  VITE_GOOGLE_CLIENT_ID: z.string().min(1, 'VITE_GOOGLE_CLIENT_ID is required'),
  VITE_GITHUB_CLIENT_ID: z.string().min(1, 'VITE_GITHUB_CLIENT_ID is required'),
})

// Server-side environment variables
const serverEnvSchema = z.object({
  VITE_GOOGLE_CLIENT_SECRET: z
    .string()
    .min(1, 'VITE_GOOGLE_CLIENT_SECRET is required'),
  VITE_GITHUB_CLIENT_SECRET: z
    .string()
    .min(1, 'VITE_GITHUB_CLIENT_SECRET is required'),
})

const _clientEnv = clientEnvSchema.safeParse(import.meta.env)

if (!_clientEnv.success) {
  console.error(
    '❌ Invalid client environment variables:',
    _clientEnv.error.format(),
  )
  throw new Error('Invalid client environment variables')
}

export const clientConfig = {
  appTitle: _clientEnv.data.VITE_APP_TITLE,
  initialCash: _clientEnv.data.VITE_INITIAL_CASH,
  marketTickRate: _clientEnv.data.VITE_MARKET_TICK_RATE,
  enableDebugTools: _clientEnv.data.VITE_ENABLE_DEBUG_TOOLS,
  googleClientId: _clientEnv.data.VITE_GOOGLE_CLIENT_ID,
  githubClientId: import.meta.env.VITE_GITHUB_CLIENT_ID || '',
} as const

type ServerConfig = {
  googleClientSecret: string
  githubClientSecret: string
}

export const serverConfig: ServerConfig = (() => {
  if (typeof window !== 'undefined') {
    return {} as ServerConfig
  }

  const _serverEnv = serverEnvSchema.safeParse(import.meta.env)

  if (!_serverEnv.success) {
    console.error(
      '❌ Invalid server environment variables:',
      _serverEnv.error.format(),
    )
    throw new Error('Invalid server environment variables')
  }

  return {
    googleClientSecret: _serverEnv.data.VITE_GOOGLE_CLIENT_SECRET,
    githubClientSecret: _serverEnv.data.VITE_GITHUB_CLIENT_SECRET || '',
  }
})()
