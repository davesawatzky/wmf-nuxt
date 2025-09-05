export default defineNuxtRouteMiddleware(async (to) => {
  const { result, onResult, onError } = useQuery(gql`
    query TokenCheck {
      tokenCheck {
        user {
          admin
          email
        }
      }
    }
  `)

  console.log('Token check result:', await result.value)

  // if (to.path !== '/' && to.path !== '/login') {
  //   onResult(async (result) => {
  //     console.log(result.data?.tokenCheck)
  //     if (!result.data?.tokenCheck) {
  //       await navigateTo('/login')
  //     }
  //   })
  //   onError(async (error) => {
  //     console.error('Error checking token:', error)
  //     await navigateTo('/login')
  //   })
  // } else if (to.path === '/') {
  //   console.log('Could not login')
  //   await navigateTo('/login')
  // }
})
