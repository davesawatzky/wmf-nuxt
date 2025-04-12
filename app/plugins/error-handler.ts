export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('vue:error', (error, instance, info) => {
    // handle error, e.g. report to a service
    console.log('Error: ', error)
    console.log('Instance: ', instance)
    console.log('Info: ', info)
  })
})
