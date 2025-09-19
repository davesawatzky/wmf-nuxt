// stores/useAuth.ts
import { defineStore } from 'pinia'
import {
  createMongoAbility,
  type MongoAbility,
  AbilityBuilder,
} from '@casl/ability'

export interface AuthUser {
  readonly id: number
  readonly email: string
  readonly roles: readonly string[]
  readonly permissions: readonly string[]
  readonly isActive: boolean
}

const usePrivateState = defineStore('privateState', () => {
  const _user = ref<AuthUser | undefined>()
  const _ability = ref<MongoAbility | undefined>()

  return { _user, _ability }
})

export const useAuthStore = defineStore('auth', () => {
  const privateState = usePrivateState()

  // Read-only computed properties
  const user = computed(() => privateState._user)
  const isAuthenticated = computed(() => !!privateState._user)
  const userRoles = computed(() => privateState._user?.roles)
  const ability = computed(() => privateState._ability)

  // Route access definitions
  const routePermissions = {
    '/admin': ['admin'],
    '/admin/reports': ['admin', 'manager'],
    '/admin/users': ['admin'],
    '/admin/settings': ['admin'],
    '/registrations': ['admin', 'manager', 'user'],
    '/form': ['admin', 'manager', 'user'],
    '/profile': ['admin', 'manager', 'user'],
  } as const

  /**
   * Set user data (only called from auth middleware)
   * Creates immutable user object
   */
  function setUser(userData: AuthUser) {
    if (!userData) {
      privateState._user = undefined
      privateState._ability = undefined
      return
    }

    // Ensure required fields exist with defaults
    const safeUserData = {
      id: userData.id,
      email: userData.email || '',
      roles: Array.isArray(userData.roles) ? userData.roles : [],
      permissions: Array.isArray(userData.permissions)
        ? userData.permissions
        : [],
      isActive: userData.isActive ?? false,
    }

    console.log('Setting user data:', safeUserData)

    // Create deeply frozen user object first
    privateState._user = Object.freeze({
      id: safeUserData.id,
      email: safeUserData.email,
      roles: Object.freeze([...safeUserData.roles]),
      permissions: Object.freeze([...safeUserData.permissions]),
      isActive: safeUserData.isActive,
    })

    // Build CASL ability based on user permissions (after user is set)
    privateState._ability = buildAbility(
      safeUserData.roles,
      safeUserData.permissions,
      safeUserData.id
    )
  }

  /**
   * Build CASL ability object
   */
  function buildAbility(
    roles: readonly string[],
    permissions: readonly string[],
    userId: number
  ) {
    const { can, build } = new AbilityBuilder(createMongoAbility)

    // Define abilities based on roles
    if (roles.includes('admin')) {
      can('manage', 'all')
    } else if (roles.includes('manager')) {
      can('read', 'User')
      can('update', 'User')
      can('read', 'Registration')
      can('update', 'Registration')
      can('read', 'Form')
      can('update', 'Form')
      can('read', 'Profile')
      can('update', 'Profile')
      can('read', 'Report')
    } else if (roles.includes('user')) {
      can('manage', 'Registration', { userId: userId })
      can('manage', 'Form', { userId: userId })
      can('read', 'Profile', { id: userId })
      can('update', 'Profile', { id: userId })
    }

    // Add specific permissions
    permissions.forEach((permission) => {
      const parts = permission.split(':')
      if (parts.length === 2) {
        const [action, subject] = parts
        if (action && subject) {
          can(action, subject)
        }
      }
    })

    return build()
  }

  /**
   * Check if user can access a specific route
   */
  function canAccessRoute(path: string, roles: string[] = []): boolean {
    // Ensure roles is an array
    const userRoles = Array.isArray(roles) ? roles : []

    // Check exact path match
    const requiredRoles =
      routePermissions[path as keyof typeof routePermissions]
    if (requiredRoles) {
      return requiredRoles.some((role) => userRoles.includes(role))
    }

    // Check pattern matches for nested routes
    const adminPaths = ['/admin']
    if (adminPaths.some((adminPath) => path.startsWith(adminPath))) {
      return userRoles.includes('admin')
    }

    // Default allow for non-restricted routes
    return true
  }

  /**
   * Check CASL ability
   */
  function can(action: string, subject: string, field?: string): boolean {
    return privateState._ability?.can(action, subject, field) || false
  }

  function cannot(action: string, subject: string, field?: string): boolean {
    return !can(action, subject, field)
  }

  /**
   * Clear user data (logout)
   */
  function clearUser() {
    privateState._user = undefined
    privateState._ability = undefined
  }

  /**
   * Check if user has specific role
   */
  function hasRole(role: string): boolean {
    console.log('Checking for role:', role, 'in', userRoles.value)
    return userRoles.value?.includes(role) ?? false
  }

  /**
   * Check if user has any of the specified roles
   */
  function hasAnyRole(roles: string[]): boolean {
    return roles.some((role) => hasRole(role))
  }

  return {
    // Read-only state
    user,
    isAuthenticated,
    userRoles,
    ability,

    // Actions
    setUser,
    clearUser,
    canAccessRoute,
    can,
    cannot,
    hasRole,
    hasAnyRole,
  }
})
