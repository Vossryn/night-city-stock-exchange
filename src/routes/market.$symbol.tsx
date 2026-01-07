import { createFileRoute, redirect } from '@tanstack/react-router'

import { CompanyDetail } from '@/features/company-detail'
import { useAuthStore } from '@/lib/auth-store'
import { company_data } from '@/lib/company-data'
import { getCompany, getMarketHistory } from '@/lib/serverFn'

export const Route = createFileRoute('/market/$symbol')({
  beforeLoad: ({ location }) => {
    if (!useAuthStore.getState().isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: CompanyDetailRoute,
  loader: async ({ params }) => {
    const dbCompany = await getCompany({ data: params.symbol })

    const history = await getMarketHistory({
      data: { days: 30, companyIds: [dbCompany.id] },
    })

    const staticCompany = company_data.find((c) => c.name === params.symbol)

    return {
      company: {
        id: parseInt(dbCompany.id, 10),
        name: dbCompany.name,
        ticker: dbCompany.ticker,
        sector: dbCompany.sector,
        price: dbCompany.price,
        image: staticCompany?.image,
        known_affiliations: staticCompany?.known_affiliations || [],
        type: staticCompany?.type || [dbCompany.sector],
      },
      history: history as Array<{
        date: string
        [key: string]: number | string
      }>,
    }
  },
})

function CompanyDetailRoute() {
  const { company, history } = Route.useLoaderData()

  return <CompanyDetail company={company} history={history} />
}
