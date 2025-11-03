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
    const appStore = useAppStore()
    const registrationId = ref(0)

    /**
     * Factory function to create an empty registration object
     * Returns a base structure matching RegistrationInput with sensible defaults
     */
    function createEmptyRegistration(): RegistrationInput & {
      id?: number
      createdAt?: string | null
      updatedAt?: string | null
      __typename?: string
    } {
      return {
        id: 0,
        performerType: undefined,
        label: null,
        confirmation: null,
        submittedAt: null,
        transactionInfo: null,
        payedAmt: 0.0,
        totalAmt: 0.0,
        createdAt: null,
        updatedAt: null,
        teacherID: null,
        __typename: 'Registration',
      }
    }

    const registration = ref(createEmptyRegistration())

    /**
     * Resets the registration store
     */
    function $reset() {
      registrationId.value = 0
      registration.value = createEmptyRegistration()
    }

    const totalClassAmt = computed(() => {
      let cost = 0.0
      for (const regClass of classesStore.registeredClasses)
        cost += Number(regClass.price)
      const total = cost + Number(lateRegistrationFee())
      return Number(total).toFixed(2)
    })

    function lateRegistrationFee() {
      let registrationDate
      if (registration.value.submittedAt) {
        registrationDate = new Date(registration.value.submittedAt)
      } else {
        registrationDate = new Date()
      }
      const lateDate = new Date(
        lateDatesAndCosts[appStore.performerType].lateDate
      )
      let lateFee = 0.0
      if (registrationDate > lateDate) {
        lateFee = lateDatesAndCosts[appStore.performerType].amount
      }
      return lateFee.toFixed(2)
    }

    watch(totalClassAmt, async (newValue) => {
      registration.value.totalAmt = Number(newValue)
      if (registration.value.id && registration.value.id > 0) {
        await updateRegistration('totalAmt')
      }
    })

    /**
     * Adds Registration Object to the store.  Can only be one.
     * @param reg Registration Object, must have valid id property value
     */
    function addToStore(reg: Partial<Registration & RegistrationInput>): void {
      registrationId.value = reg.id!
      registration.value = {
        id: reg.id!,
        performerType: reg.performerType!,
        label: reg.label || null,
        confirmation: reg.confirmation || null,
        createdAt: reg.createdAt || null,
        submittedAt: reg.submittedAt || null,
        transactionInfo: reg.transactionInfo || null,
        payedAmt: Number(reg.payedAmt) || 0.0,
        totalAmt: Number(reg.totalAmt) || 0.0,
        updatedAt: reg.updatedAt || null,
        teacherID: reg.teacherID || null,
        __typename: 'Registration',
      }
    }

    /**
     * Creates a new registration form in the store and db
     * @param performerType Type of registration according to performer type
     * @param label Specific label for the registration
     */

    const {
      mutate: registrationCreate,
      onDone: onRegistrationCreateDone,
      onError: onRegistrationCreateError,
    } = useMutation(RegistrationCreateDocument, {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    })
    async function createRegistration(
      performerType: PerformerType,
      label: string
    ) {
      await registrationCreate({ performerType, label })
    }
    onRegistrationCreateDone((result) => {
      if (result.data?.registrationCreate.registration) {
        const registration: RegistrationCreateMutation['registrationCreate']['registration'] =
          result.data.registrationCreate.registration
        addToStore(registration)
      } else if (result.data?.registrationCreate.userErrors) {
        console.error(
          'Failed to create registration:',
          result.data.registrationCreate.userErrors
        )
      }
    })
    onRegistrationCreateError((error) => {
      console.error(error)
    })

    /**
     * Updates Registration form information from store to db.
     * @param field Optional specific field to update
     * @param regId Optional registration ID (defaults to current)
     */
    const { mutate: registrationUpdate, onError: onRegistrationUpdateError } =
      useMutation(RegistrationUpdateDocument, {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      })
    async function updateRegistration(field?: string, regId?: number) {
      const { id, __typename, updatedAt, createdAt, ...regProps } =
        registration.value
      let registrationField = null
      if (field && Object.keys(regProps).includes(field)) {
        registrationField = Object.fromEntries(
          Array(Object.entries(regProps).find((item) => item[0] === field)!)
        )
      }
      try {
        await registrationUpdate({
          registrationId: regId || registrationId.value,
          registrationInput:
            registrationField || (regProps as RegistrationInput),
        })
        return 'complete'
      } catch (error) {
        console.error('Failed to update registration:', error)
        return 'error'
      }
    }
    onRegistrationUpdateError((error) => {
      console.error(error)
    })

    /**
     * Removes registration from db
     * @param regId ID of Registration Form
     */
    const {
      mutate: registrationDelete,
      onDone: onRegistrationDeleteDone,
      onError: onRegistrationDeleteError,
    } = useMutation(RegistrationDeleteDocument)
    async function deleteRegistration(regId: number) {
      await registrationDelete({ registrationId: regId })
    }
    onRegistrationDeleteDone(() => {
      $reset()
    })
    onRegistrationDeleteError((error) => {
      console.error(error)
    })

    return {
      registrationId,
      registration,
      totalClassAmt,
      $reset,
      addToStore,
      createRegistration,
      updateRegistration,
      deleteRegistration,
      lateRegistrationFee,
    }
  },
  {
    persist: true,
  }
)
