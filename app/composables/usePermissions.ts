export const usePermissions = () => {
  const authStore = useAuthStore()

  const canManageUsers = computed(() => authStore.can('manage', 'User'))
  const canViewReports = computed(() => authStore.can('read', 'Report'))
  const canEditRegistration = (registration: any) => {
    return authStore.can('update', 'Registration', registration)
  }

  return {
    canManageUsers,
    canViewReports,
    canEditRegistration,
    hasRole: authStore.hasRole,
    hasAnyRole: authStore.hasAnyRole,
    can: authStore.can,
    cannot: authStore.cannot,
  }
}
