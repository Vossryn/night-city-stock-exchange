import { createFileRoute } from '@tanstack/react-router'

import { CompanyDetail } from '@/features/company-detail'
import { getMarketHistory } from '@/hooks/useGetActiveStocks'
import { getCompany } from '@/hooks/useGetCompany'
import { company_data } from '@/lib/company-data'

export const Route = createFileRoute('/market/$symbol')({
  component: CompanyDetailRoute,
  loader: async ({ params }) => {
    const dbCompany = await getCompany({ data: params.symbol })

    const history = await getMarketHistory({
      data: { days: 30, companyIds: [dbCompany.id] },
    })

    const staticCompany = company_data.find((c) => c.name === params.symbol)

    return {
      company: {
        ...dbCompany,
        image: staticCompany?.image,
        known_affiliations: staticCompany?.known_affiliations || [],
        type: staticCompany?.type || [dbCompany.sector],
      },
      history,
    }
  },
})

function CompanyDetailRoute() {
  const { company, history } = Route.useLoaderData()

  return <CompanyDetail company={company} history={history} />
}
