import { createServerFn } from '@tanstack/react-start'

export const getCompany = createServerFn({ method: 'GET' })
  .inputValidator((name: string) => name)
  .handler(async ({ data: name }) => {
    const { getCompanyByName } = await import('@/lib/db-queries.server')
    return getCompanyByName(name)
  })
