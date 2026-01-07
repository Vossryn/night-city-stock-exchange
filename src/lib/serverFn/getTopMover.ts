import { createServerFn } from '@tanstack/react-start'

import { requireAuth } from './auth-middleware'

/**
 * Server function to fetch the top mover stock.
 * Requires authentication.
 */
export const getTopMover = createServerFn({ method: 'GET' }).handler(
  async () => {
    await requireAuth()
    const { getTopMoversFromDb } = await import('@/lib/db-queries.server')
    const movers = await getTopMoversFromDb(1)
    return movers[0]
  },
)
