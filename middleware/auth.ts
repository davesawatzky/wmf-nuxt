/* eslint-disable */
export default defineNuxtRouteMiddleware((to) => {
  if (to.path !== '/') {
    const { onResult, onError } = useQuery(gql`
      query TokenCheck {
        tokenCheck
      }
    `)
    onResult(async (result) => {
      if (!!result.data.tokenCheck === true) {
        await navigateTo(to.path)
      } else {
        await navigateTo('/login')
      }
    })
    onError((error) => {
      console.log(error)
    })
  }
  if (to.path === '/') {
    return navigateTo('/login')
  }
})
