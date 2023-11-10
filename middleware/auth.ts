/* eslint-disable */
export default defineNuxtRouteMiddleware(async (to, from) => {
  if (to.path !== '/' && to.path !== '/login') {
    const { onResult, onError } = useQuery(gql`
      query TokenCheck {
        tokenCheck
      }
    `)
    onResult(async (result) => {
      if (result.data.tokenCheck === true) {
        await navigateTo(to.path)
      } else if (result.data.tokenCheck === 'unauthorized') {
        await navigateTo('/login')
      }
    })
    onError(async (error) => {
      console.log(error)
      await navigateTo('/login')
    })
  } else if (to.path === '/' || to.path === '/login') {
    await navigateTo('/login')
  }
})
