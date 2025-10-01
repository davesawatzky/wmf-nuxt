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
    '/password/PasswordReset',
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

    if (result.tokenCheck.userErrors?.length) {
      console.warn('Auth validation errors:', result.tokenCheck.userErrors)
      return navigateTo('/login', { replace: true })
    }

    const userData = result.tokenCheck.user

    if (!userData) {
      return navigateTo('/login', { replace: true })
    }

    const authStore = useAuthStore()
    authStore.setUser(userData)

    const hasAccess = authStore.canAccessRoute(to.path, userData.roles)

    if (!hasAccess) {
      toast.error('Insufficient permissions for route')
      throw createError({
        statusCode: 403,
        statusMessage: 'Access Denied',
      })
    }
  } catch (error) {
    console.error('Auth middleware error: ', error)

    if (
      error &&
      typeof error === 'object' &&
      ('networkError' in error || 'graphQLErrors' in error)
    ) {
      return navigateTo('/login', { replace: true })
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    })
  }
})
