export default defineNuxtRouteMiddleware(async (to) => {
  const { onResult, onError } = useQuery(gql`
    query TokenCheck {
      tokenCheck
    }
  `)
  if (to.path !== '/' && to.path !== '/login') {
    onResult(async (result) => {
      if (!result.data?.tokenCheck) {
        await navigateTo('/login')
      }
    })
    onError(async (error) => {
      console.error('Error checking token:', error)
      await navigateTo('/login')
    })
  } else if (to.path === '/') {
    console.log('Could not login')
    await navigateTo('/login')
  }
})
