import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { clientConfig } from '@/lib/config'

export function Login() {
  const navigate = useNavigate()

  useEffect(() => {
    // Check if we're returning from OAuth callback
    const params = new URLSearchParams(window.location.search)
    if (params.get('success') === 'true') {
      navigate({ to: '/dashboard' })
    }
  }, [navigate])

  const handleLogin = (provider: 'github' | 'google') => {
    // Better Auth OAuth flow: Redirect to the provider's OAuth endpoint
    const callbackUrl = `${window.location.origin}/api/auth/callback/${provider}`
    const authUrl = `/api/auth/signin/${provider}?callbackUrl=${encodeURIComponent(callbackUrl)}`
    window.location.href = authUrl
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md p-8 border border-neon-blue rounded-lg bg-card shadow-[0_0_20px_rgba(0,255,255,0.2)]">
        <h1 className="text-3xl font-bold text-center mb-8 text-neon-blue tracking-wider">
          NCSE ACCESS
        </h1>

        <div className="space-y-4">
          <Button
            className="w-full bg-white text-black hover:bg-gray-200"
            variant="outline"
            onClick={() => handleLogin('github')}
            disabled={!clientConfig.githubClientId}
          >
            Continue with GitHub
          </Button>
          <Button
            className="w-full bg-red-600 text-white hover:bg-red-700"
            variant="outline"
            onClick={() => handleLogin('google')}
            disabled={!clientConfig.googleClientId}
          >
            Continue with Google
          </Button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Authorized Personnel Only.</p>
          <p>Unauthorized access is a Class A felony.</p>
        </div>
      </div>
    </div>
  )
}
