export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('vue:error', (error, instance, info) => {
    // handle error, e.g. report to a service
    console.error('Error: ', error)
    console.error('Instance: ', instance)
    console.error('Info: ', info)
  })
})
