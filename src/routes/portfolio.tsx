import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/lib/auth-store'

export const Route = createFileRoute('/portfolio')({
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
  component: Portfolio,
})

function Portfolio() {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold text-cyan-500">My Portfolio</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border border-gray-700 rounded bg-card">
          <h2 className="text-xl font-semibold mb-2">Performance</h2>
          <div className="h-40 flex items-center justify-center bg-black/30 text-gray-500">
            Chart Placeholder
          </div>
        </div>
        <div className="p-4 border border-gray-700 rounded bg-card">
          <h2 className="text-xl font-semibold mb-2">Allocation</h2>
          <div className="h-40 flex items-center justify-center bg-black/30 text-gray-500">
            Pie Chart Placeholder
          </div>
        </div>
      </div>

      <div className="border border-gray-700 rounded overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-3">Symbol</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Avg Cost</th>
              <th className="p-3">Current Price</th>
              <th className="p-3">Value</th>
              <th className="p-3">Return</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-3 text-center text-gray-500" colSpan={6}>
                No holdings yet. Go trade!
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
