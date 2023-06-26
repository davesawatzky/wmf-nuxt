export default defineNuxtRouteMiddleware((to) => {
  if (to.path !== '/') {
    const { onResult, onError } = useQuery(gql`
      query TokenCheck {
        tokenCheck
      }
    `)
    onResult((result) => {
      if (result.data.tokenCheck === true) {
        navigateTo(to.path)
      } else {
        navigateTo('/login')
      }
    })
    onError((error) => {
      console.log(error)
      navigateTo('/login')
    })
  }
  if (to.path === '/') {
    navigateTo('/login')
  }
})
