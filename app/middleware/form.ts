// Form Middleware

export default defineNuxtRouteMiddleware(async (to, from) => {
  const regExist = sessionStorage.getItem('registrations')
  if (!regExist) {
    abortNavigation()
    await navigateTo('/registrations')
    return
  }
  const reg = JSON.parse(regExist)
  if (!reg.registrationId) {
    abortNavigation()
    await navigateTo('/registrations')
  }
})
