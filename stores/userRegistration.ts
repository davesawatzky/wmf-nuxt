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
    const registrations = ref([] as Registration[])

    function $reset() {
      registrationId.value = 0
      registrations.value = []
    }

    function addToStore(data: Registration) {
      if (registrations.value.length > 0) {
        // Can only have one registration open at a time
        registrations.value.splice(0, 1, data)
      } else {
        registrations.value.push(data)
      }
    }

    async function createRegistration(
      performerType: PerformerType,
      label: string
    ) {
      const { mutate, onDone, onError } = useMutation(
        RegistrationCreateDocument
      )
      await mutate({ performerType, label })
      onDone((result) => {
        addToStore(<Registration>result.data.registrationCreate.registration)
        registrationId.value = result.data.registrationCreate.registration.id
      })
      onError((error) => {
        console.log(error)
      })
    }

    async function updateRegistration() {
      const { mutate: registrationUpdate, onError } = useMutation(
        RegistrationUpdateDocument,
        {
          fetchPolicy: 'network-only',
        }
      )
      const clone = Object.assign({}, registrations.value[0])
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
      registrations,
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
