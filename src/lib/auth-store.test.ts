import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from './auth-store'
import { DEMO_USERS } from './demo-users'

describe('Auth Store', () => {
  beforeEach(() => {
    // Reset store to default state before each test
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
    })
  })

  describe('login', () => {
    it('should login with valid user id', () => {
      const store = useAuthStore.getState()
      const result = store.login('1') // V

      expect(result).not.toBeNull()
      expect(result?.name).toBe('V')
      expect(result?.role).toBe('Netrunner')

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(true)
      expect(state.user?.id).toBe('1')
    })

    it('should return null for invalid user id', () => {
      const store = useAuthStore.getState()
      const result = store.login('invalid-id')

      expect(result).toBeNull()

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(false)
      expect(state.user).toBeNull()
    })

    it('should login as any of the 6 demo users', () => {
      for (const demoUser of DEMO_USERS) {
        // Reset state
        useAuthStore.setState({ user: null, isAuthenticated: false })

        const store = useAuthStore.getState()
        const result = store.login(demoUser.id)

        expect(result).not.toBeNull()
        expect(result?.id).toBe(demoUser.id)
        expect(result?.name).toBe(demoUser.name)
        expect(result?.email).toBe(demoUser.email)

        const state = useAuthStore.getState()
        expect(state.isAuthenticated).toBe(true)
      }
    })

    it('should update user when logging in as different user', () => {
      const store = useAuthStore.getState()

      // Login as V
      store.login('1')
      expect(useAuthStore.getState().user?.name).toBe('V')

      // Login as Johnny
      useAuthStore.getState().login('2')
      expect(useAuthStore.getState().user?.name).toBe('Johnny Silverhand')
    })
  })

  describe('logout', () => {
    it('should clear user and set isAuthenticated to false', () => {
      // First login
      useAuthStore.getState().login('1')
      expect(useAuthStore.getState().isAuthenticated).toBe(true)

      // Then logout
      useAuthStore.getState().logout()

      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.isAuthenticated).toBe(false)
    })

    it('should be safe to call even when not logged in', () => {
      // Should not throw
      expect(() => {
        useAuthStore.getState().logout()
      }).not.toThrow()

      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.isAuthenticated).toBe(false)
    })
  })

  describe('state consistency', () => {
    it('isAuthenticated should always reflect user presence', () => {
      // Initial state
      expect(useAuthStore.getState().user).toBeNull()
      expect(useAuthStore.getState().isAuthenticated).toBe(false)

      // After login
      useAuthStore.getState().login('1')
      expect(useAuthStore.getState().user).not.toBeNull()
      expect(useAuthStore.getState().isAuthenticated).toBe(true)

      // After logout
      useAuthStore.getState().logout()
      expect(useAuthStore.getState().user).toBeNull()
      expect(useAuthStore.getState().isAuthenticated).toBe(false)
    })
  })
})

describe('Demo Users', () => {
  it('should have exactly 6 demo users', () => {
    expect(DEMO_USERS).toHaveLength(6)
  })

  it('should have unique ids for all users', () => {
    const ids = DEMO_USERS.map((u) => u.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(6)
  })

  it('should have all required fields for each user', () => {
    for (const user of DEMO_USERS) {
      expect(user.id).toBeDefined()
      expect(user.name).toBeDefined()
      expect(user.email).toBeDefined()
      expect(user.avatar).toBeDefined()
      expect(user.role).toBeDefined()
      expect(user.affiliation).toBeDefined()

      // Validate types
      expect(typeof user.id).toBe('string')
      expect(typeof user.name).toBe('string')
      expect(typeof user.email).toBe('string')
      expect(user.email).toContain('@')
    }
  })

  it('should include expected characters', () => {
    const names = DEMO_USERS.map((u) => u.name)
    expect(names).toContain('V')
    expect(names).toContain('Johnny Silverhand')
    expect(names).toContain('Judy Alvarez')
    expect(names).toContain('Panam Palmer')
    expect(names).toContain('River Ward')
    expect(names).toContain('Takemura Goro')
  })
})
