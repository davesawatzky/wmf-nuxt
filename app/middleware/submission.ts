import { useRegistration } from '~/stores/useRegistration'

export default defineNuxtRouteMiddleware(async () => {
  const registrationStore = useRegistration()
  const confirmed = registrationStore.registration.confirmation
  const submitted = registrationStore.registration.submittedAt

  if (!formErrors || confirmed || submitted) {
    abortNavigation()
    await navigateTo('/Registrations')
  }
})
