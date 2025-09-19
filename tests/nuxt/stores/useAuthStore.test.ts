// tests/nuxt/stores/useAuthStore.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../../../app/stores/useAuthStore'

// Mock console.log to avoid test output noise
vi.spyOn(console, 'log').mockImplementation(() => {})

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with unauthenticated state', () => {
    const store = useAuthStore()

    expect(store.isAuthenticated).toBe(false)
    expect(store.user).toBeUndefined()
    expect(store.userRoles).toBeUndefined()
  })

  it('should set user data correctly', () => {
    const store = useAuthStore()
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      roles: ['user'],
      permissions: ['read:profile'],
      isActive: true,
    }

    store.setUser(mockUser)

    expect(store.isAuthenticated).toBe(true)
    expect(store.user?.email).toBe('test@example.com')
    expect(store.user?.id).toBe(1)
    expect(store.userRoles).toEqual(['user'])
  })

  it('should check user roles correctly', () => {
    const store = useAuthStore()
    const mockUser = {
      id: 1,
      email: 'admin@example.com',
      roles: ['admin'],
      permissions: ['read:all', 'write:all'],
      isActive: true,
    }

    store.setUser(mockUser)

    expect(store.hasRole('admin')).toBe(true)
    expect(store.hasRole('user')).toBe(false)
    expect(store.hasAnyRole(['admin', 'manager'])).toBe(true)
    expect(store.hasAnyRole(['user', 'guest'])).toBe(false)
  })

  it('should clear user data on logout', () => {
    const store = useAuthStore()
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      roles: ['user'],
      permissions: ['read:profile'],
      isActive: true,
    }

    store.setUser(mockUser)
    expect(store.isAuthenticated).toBe(true)

    store.clearUser()
    expect(store.isAuthenticated).toBe(false)
    expect(store.user).toBeUndefined()
    expect(store.userRoles).toBeUndefined()
  })

  it('should handle CASL permissions correctly', () => {
    const store = useAuthStore()

    // Test with a user role (not admin) to avoid "manage all" permissions
    const mockUser = {
      id: 1,
      email: 'user@example.com',
      roles: ['user'],
      permissions: ['read:profile', 'write:profile'],
      isActive: true,
    }

    store.setUser(mockUser)

    // User should have specific permissions
    expect(store.can('read', 'Profile')).toBe(true)
    expect(store.can('update', 'Profile')).toBe(true)

    // User should NOT have admin permissions
    expect(store.can('read', 'AllUsers')).toBe(false)
    expect(store.cannot('read', 'AllUsers')).toBe(true)
  })

  it('should handle route access correctly', () => {
    const store = useAuthStore()
    const mockUser = {
      id: 1,
      email: 'admin@example.com',
      roles: ['admin'],
      permissions: [],
      isActive: true,
    }

    store.setUser(mockUser)

    expect(store.canAccessRoute('/admin', ['admin'])).toBe(true)
    expect(store.canAccessRoute('/admin', ['user'])).toBe(false)
    expect(store.canAccessRoute('/public', [])).toBe(true)
  })

  it('should handle user with no roles safely', () => {
    const store = useAuthStore()
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      roles: [],
      permissions: [],
      isActive: true,
    }

    store.setUser(mockUser)

    expect(store.isAuthenticated).toBe(true)
    expect(store.hasRole('admin')).toBe(false)
    expect(store.hasAnyRole(['admin', 'user'])).toBe(false)
  })
})
