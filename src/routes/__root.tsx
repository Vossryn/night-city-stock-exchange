import { TanStackDevtools } from '@tanstack/react-devtools'
import { QueryClientProvider } from '@tanstack/react-query'
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import React from 'react'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

import { AppNavigation } from '@/components/app-navigation'
import { TerminalLayout } from '@/components/terminal-layout'
import { Toaster } from '@/components/ui/sonner'
import { useMarketSimulation } from '@/hooks/useMarketSimulation'
import { mockAuth } from '@/lib/mock-auth'
import { usePortfolioStore } from '@/lib/portfolio-store'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Night City Stock Exchange',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  component: RootComponent,
  shellComponent: RootDocument,
})

function RootComponent() {
  const { queryClient } = Route.useRouteContext()

  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  )
}

function AppContent() {
  const loadUserPortfolio = usePortfolioStore(
    (state) => state.loadUserPortfolio,
  )

  // Initialize current user in portfolio store on mount
  React.useEffect(() => {
    const currentUser = mockAuth.getCurrentUser()
    if (currentUser) {
      loadUserPortfolio(currentUser.id)
    }
  }, [loadUserPortfolio])

  // Initialize market simulation (runs throughout the app)
  useMarketSimulation()

  return (
    <>
      <TerminalLayout>
        <AppNavigation />
        <main className="flex-1">
          <Outlet />
        </main>
      </TerminalLayout>
      <Toaster />
    </>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        {import.meta.env.DEV && (
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        )}
        <Scripts />
      </body>
    </html>
  )
}
