import { betterAuth } from 'better-auth'

import { serverConfig } from './config'

/**
 * Better Auth configuration with stateless JWT sessions.
 * No database storage - perfect for demo/fun applications.
 * User data is stored in encrypted JWT cookies only.
 *
 * Docs: https://better-auth.com/docs
 */
export const auth = betterAuth({
  // No database adapter - fully stateless!
  emailAndPassword: {
    enabled: false, // Disabled - using OAuth only for this cyberpunk theme
  },
  socialProviders: {
    github: {
      clientId: process.env.VITE_GITHUB_CLIENT_ID || '',
      clientSecret: serverConfig.githubClientSecret,
    },
    google: {
      clientId: process.env.VITE_GOOGLE_CLIENT_ID || '',
      clientSecret: serverConfig.googleClientSecret,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  secret:
    process.env.BETTER_AUTH_SECRET || 'ncse-secret-key-change-in-production',
  advanced: {
    cookiePrefix: 'ncse',
    crossSubDomainCookies: {
      enabled: false,
    },
  },
})

export type AuthSession = typeof auth.$Infer.Session
