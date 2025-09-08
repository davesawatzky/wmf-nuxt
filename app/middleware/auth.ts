export default defineNuxtRouteMiddleware(async (to, from) => {
  const { load, refetch } = useLazyQuery(gql`
    query TokenCheck {
      tokenCheck {
        user {
          id
          email
          admin
        }
      }
    }
  `)

  async function checkAuth() {
    try {
      const result = await load()
      return result.tokenCheck.user
    } catch (error) {
      console.error('Error during auth check:', error)
      await navigateTo('/login')
    }
  }

  const userData = await checkAuth()
  console.log('Token check result:', userData)
  console.log('User roles:', userData?.roles)
  console.log('User roles type:', typeof userData?.roles)

  const publicRoutes = ['/login', '/']
  const isPublicRoute = publicRoutes.includes(to.path)

  if (!isPublicRoute) {
    if (!userData) {
      await navigateTo('/login')
      return
    }

    // Set immutable user state
    const authStore = useAuthStore()
    authStore.setUser(userData)

    // Check route permissions
    const hasAccess = await checkRoutePermissions(to, authStore.user?.roles)
    if (!hasAccess) {
      console.log('No access to route, redirecting to previous or login')
      await navigateTo(from.path || '/login')
      // throw createError({
      //   statusCode: 403,
      //   statusMessage: 'Access Denied',
      // })
    }
  } else if (to.path === '/') {
    await navigateTo('/login')
  }

  // Helper function for route permission checking
  async function checkRoutePermissions(
    to: any,
    userData: any
  ): Promise<boolean> {
    const authStore = useAuthStore()
    return authStore.canAccessRoute(to.path, userData)
  }
})
