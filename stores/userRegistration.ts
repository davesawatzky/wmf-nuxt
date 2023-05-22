import {
  RegistrationCreateDocument,
  RegistrationDeleteDocument,
  RegistrationUpdateDocument,
} from '~/graphql/gql/graphql'
import type { PerformerType, Registration } from '~/graphql/gql/graphql'

/**
 * Items get added to the Registration store when they're
 * chosen from the Registration display, not before.
 * The application only works on individual forms, therefore
 * only one registration should be in the store at any one time.
 */

export const useRegistration = defineStore(
  'registrations',
  () => {
    const registrationId = ref(0)
    const registration = ref(<Registration>{})

    function $reset() {
      registrationId.value = 0
      registration.value = <Registration>{}
    }

    function addToStore(reg: Registration) {
      registrationId.value = reg.id
      registration.value.id = reg.id
      registration.value.performerType = reg.performerType
      registration.value.label = reg.label || ''
      registration.value.confirmation = reg.confirmation || ''
      registration.value.createdAt = reg.createdAt || ''
      registration.value.submittedAt = reg.submittedAt || ''
      registration.value.transactionInfo = reg.transactionInfo || ''
      registration.value.payedAmt = reg.payedAmt || 0
      registration.value.totalAmt = reg.totalAmt || 0
      registration.value.updatedAt = reg.updatedAt || ''
      registration.value.user = reg.user
      registration.value.__typename = 'Registration'
    }

    function createRegistration(performerType: PerformerType, label: string) {
      return new Promise((resolve, reject) => {
        const {
          mutate: registrationCreate,
          onDone,
          onError,
        } = useMutation(RegistrationCreateDocument)
        registrationCreate({ performerType, label }).catch((error) =>
          console.log(error)
        )
        onDone((result) => {
          const registration: Registration =
            result.data.registrationCreate.registration
          addToStore(registration)
          resolve('Success')
        })
        onError((error) => {
          reject(console.log(error))
        })
      })
    }

    async function updateRegistration() {
      const { mutate: registrationUpdate, onError } = useMutation(
        RegistrationUpdateDocument,
        {
          fetchPolicy: 'network-only',
        }
      )
      const clone = Object.assign({}, registration.value[0])
      delete clone.id
      delete clone.__typename
      delete clone.createdAt
      await registrationUpdate({
        registrationId: registrationId.value,
        registration: clone,
      })
      onError((error) => {
        console.log(error)
      })
    }

    async function deleteRegistration(registrationId: number) {
      const { mutate: registrationDelete } = useMutation(
        RegistrationDeleteDocument
      )
      await registrationDelete({ registrationDeleteId: registrationId })
    }

    return {
      registrationId,
      registration,
      $reset,
      addToStore,
      createRegistration,
      updateRegistration,
      deleteRegistration,
    }
  },
  {
    persist: true,
  }
)
