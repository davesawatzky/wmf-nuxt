//Form Middleware

import { useRegistration } from '~/stores/userRegistration'
import { formErrors } from '@/composables/formErrors'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const registrationStore = useRegistration()
  const regExist = sessionStorage.getItem('registrations')
  const reg = JSON.parse(regExist ?? '')
  const confirmed = registrationStore.registration.confirmation

  const totalErrors = computed(() => {
    const errors: number[] = Object.values(formErrors.value.value)
    return errors.reduce((a, b) => {
      return a + b
    }, 0)
  })

  if (!reg.registrationId || !!confirmed || totalErrors.value > 0) {
    return await navigateTo('/Registrations')
  }
})
