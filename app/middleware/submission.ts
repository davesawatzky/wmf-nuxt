import { useRegistration } from '~/stores/useRegistration'
import { useFormErrors } from '~/composables/formErrors'

export default defineNuxtRouteMiddleware(async () => {
  const registrationStore = useRegistration()
  const formErrors = useFormErrors()
  const confirmed = registrationStore.registration.confirmation
  const submitted = registrationStore.registration.submittedAt

  if (!formErrors.value || confirmed || submitted) {
    abortNavigation()
    await navigateTo('/Registrations')
  }
})
