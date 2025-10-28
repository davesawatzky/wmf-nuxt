import { useToast } from 'vue-toastification'

type User = {
  id: number
  email: string
  isActive: boolean
  roles: string[]
  permissions: string[]
}

export default defineNuxtRouteMiddleware(async (to, from) => {
  const toast = useToast()
  const { load: loadTokenCheck, refetch } = useLazyQuery(gql`
    query TokenCheck {
      tokenCheck {
        user {
          id
          email
          isActive
          roles
          permissions
        }
        userErrors {
          message
        }
      }
    }
  `)

  const publicRoutes = [
    '/login',
    '/',
    '/password/EmailVerification',
    '/password/emailverification',
    '/password/PasswordReset',
    '/password/passwordreset',
    '/emailconfirmation',
  ]
  const isPublicRoute = publicRoutes.includes(to.path)

  if (to.path === '/') {
    await navigateTo('/login')
  }

  if (isPublicRoute) {
    return
  }

  try {
    const result = await loadTokenCheck()

    if (result?.tokenCheck?.userErrors?.length) {
      console.warn('Auth validation errors:', result.tokenCheck.userErrors)
      return navigateTo('/login', { replace: true })
    }

    const userData = result.tokenCheck.user

    if (!userData) {
      console.log('No user data found, redirecting to login')
      return navigateTo('/login', { replace: true })
    }

    const authStore = useAuthStore()
    authStore.setUser(userData)

    const hasAccess = authStore.canAccessRoute(to.path, userData.roles)

    if (!hasAccess) {
      toast.error('You do not have permission to access this page')
      return navigateTo('/login', { replace: true })
    }
    return
  } catch (error) {
    // Network errors or GraphQL connection failures
    if (error && typeof error === 'object') {
      const hasNetworkError = 'networkError' in error
      const hasGraphQLErrors = 'graphQLErrors' in error

      if (hasNetworkError || hasGraphQLErrors) {
        // Backend unavailable - redirect to login with error message
        toast.error('Unable to verify authentication. Please login again.')
        return navigateTo('/login', { replace: true })
      }
    }

    // Unexpected errors - still redirect to login instead of throwing
    // This prevents users from being stuck on error pages
    toast.error('An authentication error occurred')
    return navigateTo('/login', { replace: true })
  }
})
