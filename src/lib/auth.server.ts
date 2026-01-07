import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'

import { db } from '@/db'
import { serverConfig } from '@/lib/config'

// Cookie name constant - extract this if better-auth changes defaults
const SESSION_COOKIE_NAME = 'better-auth.session_token'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
  }),
  emailAndPassword: {
    enabled: false, // We're using OAuth only
  },
  socialProviders: {
    github: {
      clientId: process.env.VITE_GITHUB_CLIENT_ID as string,
      clientSecret: serverConfig.githubClientSecret,
    },
    google: {
      clientId: process.env.VITE_GOOGLE_CLIENT_ID as string,
      clientSecret: serverConfig.googleClientSecret,
    },
  },
  secret: serverConfig.betterAuthSecret,
  baseURL: serverConfig.betterAuthUrl,
})

/**
 * Helper to get session from request headers.
 * This extracts the session cookie and validates it with better-auth.
 */
export async function getSessionFromHeaders(headers: Headers) {
  try {
    // Pass all headers to better-auth for proper session extraction
    const session = await auth.api.getSession({
      headers,
    })

    return session
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}
