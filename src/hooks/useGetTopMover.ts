import { useQuery } from '@tanstack/react-query'

import { getTopMover } from '@/lib/serverFn'

/**
 * Hook to fetch the top mover stock using React Query and the server function.
 */
export function useGetTopMover() {
  return useQuery({
    queryKey: ['topMover'],
    queryFn: () => getTopMover(),
  })
}
