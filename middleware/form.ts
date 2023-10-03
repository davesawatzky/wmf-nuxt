//Form Middleware

import { useRegistration } from '~/stores/userRegistration'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const registrationStore = useRegistration()
  const regExist = sessionStorage.getItem('registrations')
  if (!regExist.registrationId) {
    abortNavigation()
    navigateTo('/Registrations')
  }
})
