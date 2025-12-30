import { TanStackDevtools } from '@tanstack/react-devtools'
import { createRootRoute, HeadContent, Link, Outlet, Scripts } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import { TerminalLayout } from '@/components/terminal-layout'
import appCss from '../styles.css?url'

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

import { useAuthStore } from '@/lib/auth-store'

// ... imports

function RootComponent() {
  const { isAuthenticated, logout, user } = useAuthStore()

  return (
    <TerminalLayout>
      <nav className="border-b border-cyan-800/50 bg-black/50 backdrop-blur sticky top-0 z-50 mb-6 -mx-4 md:-mx-8 px-4 md:px-8 py-2">
        <div className="flex h-14 items-center">
          <Link to="/" className="mr-6 flex items-center space-x-2 font-bold text-neon-yellow text-lg tracking-tighter hover:text-neon-blue transition-colors">
            NCSE
          </Link>
          <div className="flex items-center space-x-6 text-sm font-medium font-mono">
            <Link 
              to="/dashboard" 
              className="text-cyan-500/70 transition-colors hover:text-neon-blue [&.active]:text-neon-blue"
            >
              DASHBOARD
            </Link>
            <Link 
              to="/market" 
              className="text-cyan-500/70 transition-colors hover:text-neon-blue [&.active]:text-neon-blue"
            >
              MARKET
            </Link>
            <Link 
              to="/portfolio" 
              className="text-cyan-500/70 transition-colors hover:text-neon-blue [&.active]:text-neon-blue"
            >
              PORTFOLIO
            </Link>
          </div>
          <div className="ml-auto flex items-center space-x-4">
             {isAuthenticated ? (
               <div className="flex items-center gap-4">
                 <span className="text-xs text-cyan-600 hidden md:inline-block">ID: {user?.name.toUpperCase()}</span>
                 <button 
                   onClick={() => logout()}
                   className="text-sm font-medium font-mono text-neon-pink/70 transition-colors hover:text-neon-pink cursor-pointer"
                 >
                   LOGOUT
                 </button>
               </div>
             ) : (
               <Link 
                 to="/login" 
                 className="text-sm font-medium font-mono text-neon-pink/70 transition-colors hover:text-neon-pink [&.active]:text-neon-pink"
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
