/* eslint-disable */
export default defineNuxtRouteMiddleware(async (to, from) => {
  let allowed = false
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
      await navigateTo('/login')
    })
  } else if (to.path === '/') {
    console.log('Could not login')
    await navigateTo('/login')
  }
})
