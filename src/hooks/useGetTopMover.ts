import { useQuery } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'

/**
 * Server function to fetch the top mover stock.
 */
export const getTopMover = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { getTopMoversFromDb } = await import('@/lib/db-queries.server')
    const movers = await getTopMoversFromDb(1)
    return movers[0]
  },
)

/**
 * Hook to fetch the top mover stock using React Query and the server function.
 */
export function useGetTopMover() {
  return useQuery({
    queryKey: ['topMover'],
    queryFn: () => getTopMover(),
  })
}
