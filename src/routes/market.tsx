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
      <Outlet />
    </div>
  )
}
