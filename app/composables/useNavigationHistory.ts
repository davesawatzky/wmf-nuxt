export const useNavigationHistory = () => {
  const clearUserSession = () => {
    // Clear browser history
    window.history.replaceState(null, '', '/login')

    // Navigate to login without history
    return navigateTo('/login', {
      replace: true,
      external: false,
    })
  }

  const preventBackNavigation = () => {
    window.history.pushState(null, '', window.location.href)
    window.addEventListener('popstate', () => {
      window.history.pushState(null, '', window.location.href)
    })
  }

  return {
    clearUserSession,
    preventBackNavigation,
  }
}
