/**
 * Mock Authentication System for Demo
 * No real auth, no database, no OAuth - just themed character selection!
 */

export interface DemoUser {
  id: string
  name: string
  email: string
  avatar: string
  role: string
  affiliation: string
}

export const DEMO_USERS: Array<DemoUser> = [
  {
    id: '1',
    name: 'V',
    email: 'v@nightcity.net',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=V',
    role: 'Netrunner',
    affiliation: 'Independent',
  },
  {
    id: '2',
    name: 'Johnny Silverhand',
    email: 'johnny@samurai.net',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Johnny',
    role: 'Rockerboy',
    affiliation: 'Samurai',
  },
  {
    id: '3',
    name: 'Judy Alvarez',
    email: 'judy@moxes.net',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Judy',
    role: 'Braindance Technician',
    affiliation: 'Moxes',
  },
  {
    id: '4',
    name: 'Panam Palmer',
    email: 'panam@aldecaldos.net',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Panam',
    role: 'Nomad',
    affiliation: 'Aldecaldos',
  },
  {
    id: '5',
    name: 'River Ward',
    email: 'river@ncpd.gov',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=River',
    role: 'Ex-NCPD Detective',
    affiliation: 'NCPD',
  },
  {
    id: '6',
    name: 'Takemura Goro',
    email: 'takemura@arasaka.corp',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Takemura',
    role: 'Bodyguard',
    affiliation: 'Arasaka',
  },
]

const STORAGE_KEY = 'ncse-demo-user'

export const mockAuth = {
  /**
   * Login with a demo user by ID
   */
  login: (userId: string): DemoUser | null => {
    const user = DEMO_USERS.find((u) => u.id === userId)
    if (user) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      }
      return user
    }
    return null
  },

  /**
   * Logout current user
   */
  logout: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
  },

  /**
   * Get currently logged in user
   */
  getCurrentUser: (): DemoUser | null => {
    if (typeof window === 'undefined') {
      return null
    }
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return mockAuth.getCurrentUser() !== null
  },

  /**
   * Get all available demo users
   */
  getAvailableUsers: (): Array<DemoUser> => {
    return DEMO_USERS
  },
}
