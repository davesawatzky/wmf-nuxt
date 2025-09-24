export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()

  if (!authStore.hasRole('user')) {
    // throw createError({
    //   statusCode: 403,
    //   statusMessage: 'User access required',
    // })
    return undefined
  }
})
