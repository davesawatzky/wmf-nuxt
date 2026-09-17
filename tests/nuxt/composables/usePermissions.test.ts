import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { usePermissions } from '../../../app/composables/usePermissions'
import { useAuthStore } from '../../../app/stores/useAuthStore'

describe('usePermissions', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('exposes hasRole, hasAnyRole, can and cannot from the auth store', () => {
    const { hasRole, hasAnyRole, can, cannot } = usePermissions()
    expect(typeof hasRole).toBe('function')
    expect(typeof hasAnyRole).toBe('function')
    expect(typeof can).toBe('function')
    expect(typeof cannot).toBe('function')
  })

  it('canManageUsers delegates to authStore.can with manage/User', () => {
    const authStore = useAuthStore()
    const canSpy = vi.spyOn(authStore, 'can').mockReturnValue(true)

    const { canManageUsers } = usePermissions()

    expect(canManageUsers.value).toBe(true)
    expect(canSpy).toHaveBeenCalledWith('manage', 'User')
  })

  it('canViewReports delegates to authStore.can with read/Report', () => {
    const authStore = useAuthStore()
    const canSpy = vi.spyOn(authStore, 'can').mockReturnValue(false)

    const { canViewReports } = usePermissions()

    expect(canViewReports.value).toBe(false)
    expect(canSpy).toHaveBeenCalledWith('read', 'Report')
  })

  it('canEditRegistration delegates to authStore.can with update/Registration', () => {
    const authStore = useAuthStore()
    const canSpy = vi.spyOn(authStore, 'can').mockReturnValue(true)

    const { canEditRegistration } = usePermissions()
    const registration = { id: 1 }

    expect(canEditRegistration(registration)).toBe(true)
    expect(canSpy).toHaveBeenCalledWith('update', 'Registration', registration)
  })
})
