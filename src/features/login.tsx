import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuthStore } from '@/lib/auth-store'
import { DEMO_USERS } from '@/lib/mock-auth'
import { usePortfolioStore } from '@/lib/portfolio-store'

export function Login() {
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const login = useAuthStore((state) => state.login)
  const loadUserPortfolio = usePortfolioStore(
    (state) => state.loadUserPortfolio,
  )

  const handleSelectUser = (userId: string) => {
    const user = login(userId)
    if (user) {
      // Load the user's portfolio
      loadUserPortfolio(user.id)

      // Get redirect URL from search params and navigate
      const params = new URLSearchParams(window.location.search)
      const redirectUrl = params.get('redirect') || '/dashboard'
      // Use window.location for redirect URLs to handle any valid path
      window.location.href = redirectUrl
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-neon-blue tracking-wider mb-2">
            NCSE ACCESS TERMINAL
          </h1>
          <p className="text-gray-400 text-sm">
            SELECT YOUR NETRUNNER IDENTITY
          </p>
          <div className="mt-4 inline-block px-4 py-2 bg-neon-blue/10 border border-neon-blue rounded text-neon-blue text-xs">
            DEMO MODE - No real authentication required
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEMO_USERS.map((user) => (
            <Card
              key={user.id}
              className={`p-6 cursor-pointer transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] ${
                selectedUser === user.id
                  ? 'border-neon-blue shadow-[0_0_20px_rgba(0,255,255,0.3)]'
                  : 'border-gray-700'
              }`}
              onClick={() => setSelectedUser(user.id)}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <img
                  alt={user.name}
                  className="w-24 h-24 rounded-full border-2 border-neon-blue object-cover"
                  src={user.avatar}
                />
                <div>
                  <h3 className="font-bold text-lg text-neon-blue">
                    {user.name}
                  </h3>
                  <p className="text-sm text-gray-400">{user.role}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {user.affiliation}
                  </p>
                </div>
                <div className="text-xs text-gray-500 font-mono">
                  {user.email}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {selectedUser && (
          <div className="mt-8 text-center">
            <Button
              className="bg-neon-blue text-black hover:bg-neon-blue/80 px-8 py-6 text-lg font-bold tracking-wider"
              onClick={() => handleSelectUser(selectedUser)}
            >
              JACK IN
            </Button>
          </div>
        )}

        <div className="mt-8 text-center text-sm text-gray-500">
          <p className="font-mono">
            &gt; SYSTEM STATUS: <span className="text-green-500">ONLINE</span>
          </p>
          <p className="mt-2 text-xs">
            Demo mode active. Click any character to access the trading
            terminal.
          </p>
        </div>
      </div>
    </div>
  )
}
