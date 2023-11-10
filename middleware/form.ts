//Form Middleware

export default defineNuxtRouteMiddleware(async (to, from) => {
  const regExist = sessionStorage.getItem('registrations')
  const reg = JSON.parse(regExist ?? '')
  if (!reg.registrationId) {
    abortNavigation()
    navigateTo('/Registrations')
  }
})
