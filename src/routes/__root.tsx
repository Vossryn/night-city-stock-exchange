import { TanStackDevtools } from '@tanstack/react-devtools'
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import appCss from '../styles.css?url'

import { TerminalLayout } from '@/components/terminal-layout'
import { useAuthStore } from '@/lib/auth-store'

export const Route = createRootRoute({
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
  const { isAuthenticated, logout, user } = useAuthStore()

  return (
    <TerminalLayout>
      <nav className="border-b border-cyan-800/50 bg-black/50 backdrop-blur -mx-4 md:-mx-8 px-4 md:px-8 py-2">
        <div className="flex h-10 items-center">
          <Link
            to="/"
            className="mr-6 flex items-center space-x-2 font-bold text-cyan-500 text-lg tracking-tighter hover:text-neon-blue transition-colors"
          >
            NCSE
          </Link>
          <div className="flex items-center space-x-4 text-sm font-medium font-mono">
            <Link
              to="/dashboard"
              className="flex items-center px-3 py-1 border-2 border-cyan-800/50 bg-black/50 text-cyan-500/70 transition-all hover:text-neon-blue hover:border-neon-blue/50 hover:shadow-[0_0_10px_rgba(6,182,212,0.3)] [&.active]:text-neon-blue [&.active]:border-neon-blue [&.active]:shadow-[0_0_20px_rgba(6,182,212,0.3)] [&.active]:bg-linear-to-b [&.active]:from-transparent [&.active]:to-neon-blue/30"
            >
              DASHBOARD
            </Link>
            <Link
              to="/market"
              className="flex items-center px-3 py-1 border-2 border-cyan-800/50 bg-black/50 text-cyan-500/70 transition-all hover:text-neon-blue hover:border-neon-blue/50 hover:shadow-[0_0_10px_rgba(6,182,212,0.3)] [&.active]:text-neon-blue [&.active]:border-neon-blue [&.active]:shadow-[0_0_20px_rgba(6,182,212,0.3)] [&.active]:bg-linear-to-b [&.active]:from-transparent [&.active]:to-neon-blue/30"
            >
              MARKET
            </Link>
            <Link
              to="/portfolio"
              className="flex items-center px-3 py-1 border-2 border-cyan-800/50 bg-black/50 text-cyan-500/70 transition-all hover:text-neon-blue hover:border-neon-blue/50 hover:shadow-[0_0_10px_rgba(6,182,212,0.3)] [&.active]:text-neon-blue [&.active]:border-neon-blue [&.active]:shadow-[0_0_20px_rgba(6,182,212,0.3)] [&.active]:bg-linear-to-b [&.active]:from-transparent [&.active]:to-neon-blue/30"
            >
              PORTFOLIO
            </Link>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-xs text-cyan-600 hidden md:inline-block">
                  ID: {user?.name.toUpperCase()}
                </span>
                <button
                  onClick={() => logout()}
                  className="flex items-center px-3 py-1 border-2 border-cyan-800/50 bg-black/50 text-cyan-500/70 transition-all hover:text-neon-blue hover:border-neon-blue/50 hover:shadow-[0_0_10px_rgba(6,182,212,0.3)] cursor-pointer text-sm font-medium font-mono"
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center px-3 py-1 border-2 border-cyan-800/50 bg-black/50 text-cyan-500/70 transition-all hover:text-neon-blue hover:border-neon-blue/50 hover:shadow-[0_0_10px_rgba(6,182,212,0.3)] [&.active]:text-neon-blue [&.active]:border-neon-blue [&.active]:shadow-[0_0_20px_rgba(6,182,212,0.3)] [&.active]:bg-linear-to-b [&.active]:from-transparent [&.active]:to-neon-blue/30 text-sm font-medium font-mono"
              >
                LOGIN
              </Link>
            )}
          </div>
        </div>
      </nav>
      <main className="flex-1">
        <Outlet />
      </main>
    </TerminalLayout>
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
