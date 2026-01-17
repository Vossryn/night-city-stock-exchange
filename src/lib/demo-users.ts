/**
 * Demo Users - Shared types and data for mock authentication
 * Extracted to avoid circular dependencies between auth-store and mock-auth
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
    avatar: '/images/v.jpg',
    role: 'Netrunner',
    affiliation: 'Independent',
  },
  {
    id: '2',
    name: 'Johnny Silverhand',
    email: 'johnny@samurai.net',
    avatar: '/images/silverhand.jpg',
    role: 'Rockerboy',
    affiliation: 'Samurai',
  },
  {
    id: '3',
    name: 'Judy Alvarez',
    email: 'judy@moxes.net',
    avatar: '/images/judy.jpg',
    role: 'Braindance Technician',
    affiliation: 'Moxes',
  },
  {
    id: '4',
    name: 'Panam Palmer',
    email: 'panam@aldecaldos.net',
    avatar: '/images/panam.jpg',
    role: 'Nomad',
    affiliation: 'Aldecaldos',
  },
  {
    id: '5',
    name: 'River Ward',
    email: 'river@ncpd.gov',
    avatar: '/images/river.jpg',
    role: 'Ex-NCPD Detective',
    affiliation: 'NCPD',
  },
  {
    id: '6',
    name: 'Takemura Goro',
    email: 'takemura@arasaka.corp',
    avatar: '/images/takemura.jpg',
    role: 'Bodyguard',
    affiliation: 'Arasaka',
  },
]
