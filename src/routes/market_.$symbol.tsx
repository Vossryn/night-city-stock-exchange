import { createFileRoute, notFound, redirect } from '@tanstack/react-router'

import { CompanyDetail } from '@/features/company-detail'
import { company_data } from '@/lib/company-data'
import { mockAuth } from '@/lib/mock-auth'
import { getCompany, getMarketHistory } from '@/lib/serverFn'

export const Route = createFileRoute('/market_/$symbol')({
  beforeLoad: ({ location }) => {
    if (!mockAuth.isAuthenticated()) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  loader: async ({ params }) => {
    // Load company data by ticker
    const dbCompany = await getCompany({ data: params.symbol })

    // Handle case where company is not found in database
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (dbCompany == null || !dbCompany.id) {
      throw notFound()
    }

    const history = await getMarketHistory({
      data: { days: 365, companyIds: [dbCompany.id] },
    })

    // Match static company data by name (from database result)
    const staticCompany = company_data.find((c) => c.name === dbCompany.name)

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
  component: CompanyDetailRoute,
})

function CompanyDetailRoute() {
  const { company, history } = Route.useLoaderData()

  return <CompanyDetail company={company} history={history} />
}
