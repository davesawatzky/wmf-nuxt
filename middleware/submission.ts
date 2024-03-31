// Form Middleware

import { useRegistration } from '~/stores/userRegistration'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const registrationStore = useRegistration()
  const regExist = registrationStore.registrationId
  const confirmed = registrationStore.registration.confirmation
  const submitted = registrationStore.registration.submittedAt

  if (!regExist || confirmed || submitted) {
    abortNavigation()
    navigateTo('/Registrations')
  }
})
