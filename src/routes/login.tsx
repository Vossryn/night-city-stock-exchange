import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/lib/auth-store'

export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    if (useAuthStore.getState().isAuthenticated) {
      throw redirect({
        to: '/dashboard',
      })
    }
  },
  component: Login,
})

function Login() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)

  const handleLogin = (provider: string) => {
    // Simulate login
    login({ name: 'Edgerunner', email: `user@${provider.toLowerCase()}.com` })
    navigate({ to: '/dashboard' })
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
            onClick={() => handleLogin('GitHub')}
          >
            Continue with GitHub
          </Button>
          <Button
            className="w-full bg-red-600 text-white hover:bg-red-700"
            variant="outline"
            onClick={() => handleLogin('Google')}
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
