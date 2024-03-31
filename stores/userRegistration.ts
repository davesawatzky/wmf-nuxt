import {
  RegistrationCreateDocument,
  RegistrationDeleteDocument,
  RegistrationUpdateDocument,
} from '~/graphql/gql/graphql'
import type {
  PerformerType,
  Registration,
  RegistrationCreateMutation,
  RegistrationInput,
} from '~/graphql/gql/graphql'

/**
 * Items get added to the Registration store when they're
 * chosen from the Registration display, not before.
 * The application only works on individual forms, therefore
 * only one registration should be in the store at any one time.
 */
export const useRegistration = defineStore(
  'registrations',
  () => {
    const classesStore = useClasses()
    const registrationId = ref(0)
    const registration = ref(<Registration & RegistrationInput>{})

    /**
     * Resets the registration store
     */
    function $reset() {
      registrationId.value = 0
      registration.value = <Registration>{}
    }

    const totalClassAmt = computed(() => {
      let cost = 0.0
      for (const regClass of classesStore.registeredClasses)
        cost += Number(regClass.price)

      registration.value.totalAmt = cost
      return Number(cost).toFixed(2)
    })

    watch(totalClassAmt, async (newValue) => {
      if (Number.parseInt(newValue) > 0)
        await updateRegistration('totalAmt')
    })

    const processingFee = computed(() => {
      return (
        Number(+registration.value.totalAmt + 0.3) / (1 - 0.029)
        - +registration.value.totalAmt
      ).toFixed(2)
    })

    /**
     * Adds Registration Object to the store.  Can only be one.
     * @param reg Registration Object, must have valid id property value
     */
    function addToStore(reg: Partial<Registration & RegistrationInput>): void {
      registrationId.value = reg.id!
      registration.value.id = reg.id!
      registration.value.performerType = reg.performerType!
      registration.value.label = reg.label || ''
      registration.value.confirmation = reg.confirmation || ''
      registration.value.createdAt = reg.createdAt || ''
      registration.value.submittedAt = reg.submittedAt || ''
      registration.value.transactionInfo = reg.transactionInfo || ''
      registration.value.payedAmt = Number(reg.payedAmt) || 0.0
      registration.value.totalAmt = Number(reg.totalAmt) || 0.0
      registration.value.updatedAt = reg.updatedAt || ''
      registration.value.teacherID = reg.teacherID || null
      registration.value.__typename = 'Registration'
    }

    /**
     * Creates a new registration form in the store and db
     * @param performerType Type of registration according to performer type
     * @param label Specific label for the registration
     * @returns Promise
     */
    function createRegistration(
      performerType: PerformerType,
      label: string,
    ): Promise<unknown> {
      return new Promise((resolve, reject) => {
        const {
          mutate: registrationCreate,
          onDone,
          onError,
        } = useMutation(RegistrationCreateDocument)
        registrationCreate({ performerType, label }).catch(error =>
          console.log(error),
        )
        onDone((result) => {
          if (result.data?.registrationCreate.registration) {
            const registration: RegistrationCreateMutation['registrationCreate']['registration']
              = result.data.registrationCreate.registration
            addToStore(registration)
            resolve('Success')
          }
          else if (result.data?.registrationCreate.userErrors) {
            console.log(result.data.registrationCreate.userErrors)
          }
        })
        onError((error) => {
          reject(console.log(error))
        })
      })
    }

    /**
     * Updates Registration form information from store to db.
     * @returns Promise
     */
    function updateRegistration(field?: string): Promise<unknown> {
      return new Promise((resolve, reject) => {
        const {
          mutate: registrationUpdate,
          onDone,
          onError,
        } = useMutation(RegistrationUpdateDocument, {
          fetchPolicy: 'network-only',
        })
        const { id, __typename, updatedAt, createdAt, ...regProps }
          = registration.value
        let registrationField = null
        if (field && Object.keys(regProps).includes(field)) {
          registrationField = Object.fromEntries(
            Array(Object.entries(regProps).find(item => item[0] === field)!),
          )
        }
        registrationUpdate({
          registrationId: registrationId.value,
          registrationInput: <RegistrationInput>(registrationField || regProps),
        }).catch(error => console.log(error))
        onDone(() => {
          resolve('Success')
        })
        onError((error) => {
          reject(console.log(error))
        })
      })
    }

    /**
     * Removes registration from db
     * @param registrationId ID of Registration Form
     * @returns Promise
     */
    function deleteRegistration(registrationId: number): Promise<unknown> {
      return new Promise((resolve, reject) => {
        const {
          mutate: registrationDelete,
          onDone,
          onError,
        } = useMutation(RegistrationDeleteDocument)
        registrationDelete({ registrationId }).catch(error =>
          console.log(error),
        )
        onDone(() => {
          $reset()
          resolve('Success')
        })
        onError((error) => {
          reject(console.log(error))
        })
      })
    }

    return {
      registrationId,
      registration,
      processingFee,
      totalClassAmt,
      $reset,
      addToStore,
      createRegistration,
      updateRegistration,
      deleteRegistration,
    }
  },
  {
    persist: true,
  },
)
