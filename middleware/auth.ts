/* eslint-disable */
export default defineNuxtRouteMiddleware( ( to, from ) => {
  let allowed = false
  if (to.path !== '/' && to.path !== '/login') {
    const { onResult, onError } = useQuery(gql`
      query TokenCheck {
        tokenCheck
      }
    `)
    onResult(( result ) => {
      console.log('Result: ', result)
      if ( result.data.tokenCheck !== true ) {
        navigateTo('/login')
      }
    })
    onError(async (error) => {
      console.log(error)
      navigateTo('/login')
    })
  } else if (to.path === '/') {
    navigateTo('/login')
  }
})
