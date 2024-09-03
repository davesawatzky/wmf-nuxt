/* eslint-disable */
export default defineNuxtRouteMiddleware((to, from) => {
  let allowed = false
  if (to.path !== '/' && to.path !== '/login') {
    const { onResult, onError } = useQuery(gql`
      query TokenCheck {
        tokenCheck
      }
    `)
    onResult((result) => {
      if (!result.data?.tokenCheck) {
        navigateTo('/login')
      }
    })
    onError(async (error) => {
      navigateTo('/login')
    })
  } else if (to.path === '/') {
    console.log('Could not login')
    navigateTo('/login')
  }
})
