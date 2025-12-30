import { useAuthStore } from '@/lib/auth-store'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
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
  component: Dashboard,
})

function Dashboard() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-3xl font-bold text-neon-blue">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border border-neon-pink rounded bg-black/50">
          <h2 className="text-xl font-semibold mb-2">Account Snapshot</h2>
          <p>Net Worth: $0.00</p>
          <p>Buying Power: $0.00</p>
        </div>
        <div className="p-4 border border-neon-yellow rounded bg-black/50">
          <h2 className="text-xl font-semibold mb-2">Market Status</h2>
          <p>Status: OPEN</p>
        </div>
        <div className="p-4 border border-neon-blue rounded bg-black/50">
          <h2 className="text-xl font-semibold mb-2">Top Movers</h2>
          <p>No data yet</p>
        </div>
      </div>
    </div>
  )
}
