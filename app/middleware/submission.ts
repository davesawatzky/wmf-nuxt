import { useRegistration } from '~/stores/useRegistration'
import { useTabErrors } from '~/composables/tabErrors'

export default defineNuxtRouteMiddleware(async () => {
  const registrationStore = useRegistration()
  const tabErrors = useTabErrors()
  const confirmed = registrationStore.registration.confirmation
  const submitted = registrationStore.registration.submittedAt

  if (!tabErrors.value || confirmed || submitted) {
    abortNavigation()
    await navigateTo('/Registrations')
  }
})
