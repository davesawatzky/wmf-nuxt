export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()

  if (!authStore.hasAnyRole(['admin', 'manager'])) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Manager access required',
    })
  }
})
