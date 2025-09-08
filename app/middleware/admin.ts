export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()

  if (!authStore.hasRole('admin')) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Admin access required',
    })
  }
})
