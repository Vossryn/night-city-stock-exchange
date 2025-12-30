import { createFileRoute } from '@tanstack/react-router'

import { company_data } from '@/lib/company-data'

export const Route = createFileRoute('/market/$symbol')({
  component: CompanyDetail,
  loader: ({ params }) => {
    const company = company_data.find((c) => c.name === params.symbol)
    if (!company) throw new Error('Company not found')
    return { company }
  },
})

function CompanyDetail() {
  const { company } = Route.useLoaderData()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <img src={company.image} alt={company.name} className="w-20 h-20 object-contain" />
        <div>
          <h1 className="text-4xl font-bold text-neon-pink">{company.name}</h1>
          <p className="text-xl text-gray-400">{company.type.join(', ')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="p-6 border border-gray-700 rounded bg-card">
            <h2 className="text-xl font-semibold mb-4">Price Chart</h2>
            <div className="h-64 flex items-center justify-center bg-black/30 text-gray-500">
              Chart Placeholder
            </div>
          </div>
          
          <div className="p-6 border border-gray-700 rounded bg-card">
            <h2 className="text-xl font-semibold mb-2">Affiliations</h2>
            <div className="flex flex-wrap gap-2">
              {company.known_affiliations.length > 0 ? (
                company.known_affiliations.map((aff) => (
                  <span key={aff} className="px-2 py-1 bg-gray-800 rounded text-sm">{aff}</span>
                ))
              ) : (
                <span className="text-gray-500">None known</span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-6 border border-neon-blue rounded bg-card">
            <h2 className="text-xl font-semibold mb-4">Trade {company.name}</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Current Price</span>
                <span className="font-mono text-neon-yellow">${company.current_share_value.toFixed(2)}</span>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-neon-blue text-black font-bold py-2 rounded hover:bg-blue-400">
                  BUY
                </button>
                <button className="flex-1 bg-neon-pink text-black font-bold py-2 rounded hover:bg-pink-400">
                  SELL
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
