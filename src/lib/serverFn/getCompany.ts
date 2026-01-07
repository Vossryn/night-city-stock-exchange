import { createServerFn } from '@tanstack/react-start'

import { requireAuth } from './auth-middleware'

/**
 * Server function to fetch a company by name.
 * Requires authentication.
 */
export const getCompany = createServerFn({ method: 'GET' })
  .inputValidator((name: string) => name)
  .handler(async ({ data: name }) => {
    await requireAuth()
    const { getCompanyByName } = await import('@/lib/db-queries.server')
    return getCompanyByName(name)
  })
