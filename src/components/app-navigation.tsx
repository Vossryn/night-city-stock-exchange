import { Link } from '@tanstack/react-router'

import { useCurrentUser, useLogout } from '@/hooks/useCurrentUser'

export function AppNavigation() {
  const { isAuthenticated, user } = useCurrentUser()
  const logout = useLogout()

  return (
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
          <Link
            to="/transactions"
            className="flex items-center px-3 py-1 border-2 border-cyan-800/50 bg-black/50 text-cyan-500/70 transition-all hover:text-neon-blue hover:border-neon-blue/50 hover:shadow-[0_0_10px_rgba(6,182,212,0.3)] [&.active]:text-neon-blue [&.active]:border-neon-blue [&.active]:shadow-[0_0_20px_rgba(6,182,212,0.3)] [&.active]:bg-linear-to-b [&.active]:from-transparent [&.active]:to-neon-blue/30"
          >
            HISTORY
          </Link>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {user?.avatar && (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border-2 border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)] object-cover"
                  />
                )}
                <span className="text-xs text-cyan-600 hidden md:inline-block">
                  {user?.name.toUpperCase()}
                </span>
              </div>
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
  )
}
