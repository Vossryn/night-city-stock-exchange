import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'

import { db } from '@/db'
import { serverConfig } from '@/lib/config'

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
    const cookieHeader = headers.get('cookie')
    if (!cookieHeader) {
      return null
    }

    // better-auth uses a cookie named 'better-auth.session_token' by default
    const sessionToken = cookieHeader
      .split(';')
      .find((c) => c.trim().startsWith('better-auth.session_token='))
      ?.split('=')[1]

    if (!sessionToken) {
      return null
    }

    // Validate session with better-auth
    const session = await auth.api.getSession({
      headers: new Headers({
        cookie: `better-auth.session_token=${sessionToken}`,
      }),
    })

    return session
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}
