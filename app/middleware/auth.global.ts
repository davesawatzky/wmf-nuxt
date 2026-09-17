export default defineNuxtRouteMiddleware(async (to) => {
  const toast = useToast()
  const authStore = useAuthStore()
  const { handleError } = useErrorHandler()
  const { load: loadTokenCheck, refetch: refetchTokenCheck } = useLazyQuery(gql`
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
    '/EmailConfirmation',
  ]
  const isPublicRoute = publicRoutes.includes(to.path)

  if (to.path === '/') {
    await navigateTo('/login')
  }

  if (isPublicRoute) {
    return
  }

  try {
    const result = (await loadTokenCheck()) || (await refetchTokenCheck())

    if (result?.tokenCheck?.userErrors?.length) {
      console.warn('Auth validation errors:', result.tokenCheck.userErrors)
      toast.add({
        severity: 'error',
        summary: 'Authentication Required',
        detail: 'Authentication required. Please login.',
        life: 3000
      })
      
      return navigateTo('/login', { replace: true })
    }

    const userData = result.tokenCheck.user

    if (!userData) {
      console.warn('No user data found, redirecting to login')
      toast.add({
        severity: 'error',
        summary: 'Authentication Required',
        detail: 'Authentication required. Please login.',
        life: 3000
      })
      return navigateTo('/login', { replace: true })
    }

    authStore.setUser(userData)
    const hasAccess = authStore.canAccessRoute(to.path, userData.roles)

    if (!hasAccess) {
      console.warn('User lacks permission for route:', to.path)
      toast.add({
        severity: 'error',
        summary: 'Access Denied',
        detail: 'You do not have permission to access this page',
        life: 3000
      })
      return navigateTo('/login', { replace: true })
    }
  }
  catch (error) {
    handleError( error, {
      toastSeverity: 'error',
      level: 'error',
      userMessage: 'An unexpected error occurred during authentication check.',
      operation: 'TokenCheck',
      context: { route: to.path }
    })
    return navigateTo('/login', { replace: true })
  }
})
