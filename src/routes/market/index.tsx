import { Link, createFileRoute } from '@tanstack/react-router'

import { company_data } from '@/lib/company-data'

export const Route = createFileRoute('/market/')({
  component: MarketIndex,
})

function MarketIndex() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Listed Companies</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {company_data.map((company) => (
          <Link
            key={company.name}
            to="/market/$symbol"
            params={{ symbol: company.name }}
            className="block p-4 border border-gray-700 hover:border-neon-blue transition-colors rounded bg-card"
          >
            <div className="flex items-center gap-3">
              <img
                src={company.image}
                alt={company.name}
                className="w-12 h-12 object-contain"
              />
              <div>
                <h3 className="font-bold">{company.name}</h3>
                <p className="text-sm text-gray-400">
                  {company.type.join(', ')}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
