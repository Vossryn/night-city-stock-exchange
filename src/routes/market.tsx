import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/lib/auth-store'

export const Route = createFileRoute('/market')({
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
  component: MarketLayout,
})

function MarketLayout() {
  return (
    <div className="p-4">
      <div className="mb-4 border-b border-gray-800 pb-2">
        <h1 className="text-2xl font-bold text-neon-yellow">
          Night City Stock Exchange
        </h1>
      </div>
      <Outlet />
    </div>
  )
}
