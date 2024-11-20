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
      let total = cost + Number(lateRegistrationFee())
      return Number(total).toFixed(2)
    })

    function lateRegistrationFee() {
      let registrationDate
      if (!!registration.value.submittedAt) {
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

    watch(totalClassAmt, async (newValue, oldValue) => {
      registration.value.totalAmt = Number(newValue)
      if (registration.value.id > 0) {
        await updateRegistration('totalAmt')
      }
    })

    /**
     * Adds Registration Object to the store.  Can only be one.
     * @param reg Registration Object, must have valid id property value
     */
    function addToStore(reg: Partial<Registration & RegistrationInput>): void {
      registrationId.value = reg.id!
      registration.value.id = reg.id!
      registration.value.performerType = reg.performerType!
      registration.value.label = reg.label || null
      registration.value.confirmation = reg.confirmation || null
      registration.value.createdAt = reg.createdAt || null
      registration.value.submittedAt = reg.submittedAt || null
      registration.value.transactionInfo = reg.transactionInfo || null
      registration.value.payedAmt = Number(reg.payedAmt) || 0.0
      registration.value.totalAmt = Number(reg.totalAmt) || 0.0
      registration.value.updatedAt = reg.updatedAt || null
      registration.value.teacherID = reg.teacherID || null
      registration.value.__typename = 'Registration'
    }

    /**
     * Creates a new registration form in the store and db
     * @param performerType Type of registration according to performer type
     * @param label Specific label for the registration
     */

    const {
      mutate: registrationCreate,
      loading: registrationCreateLoading,
      onDone: onRegistrationCreateDone,
      onError: onRegistrationCreateError,
    } = useMutation(RegistrationCreateDocument)
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
        console.log(result.data.registrationCreate.userErrors)
      }
    })
    onRegistrationCreateError((error) => {
      console.log(error)
    })

    /**
     * Updates Registration form information from store to db.
     */
    const {
      mutate: registrationUpdate,
      loading: registrationUpdateLoading,
      onDone: onRegistrationUpdateDone,
      onError: onRegistrationUpdateError,
    } = useMutation(RegistrationUpdateDocument, {
      fetchPolicy: 'network-only',
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
          registrationInput: <RegistrationInput>(registrationField || regProps),
        })
        return 'complete'
      } catch (error) {
        console.log(error)
        return 'error'
      }
    }
    onRegistrationUpdateError((error) => {
      console.log(error)
    })

    /**
     * Removes registration from db
     * @param registrationId ID of Registration Form
     * @returns Promise
     */
    const {
      mutate: registrationDelete,
      loading: registrationDeleteLoading,
      onDone: onRegistrationDeleteDone,
      onError: onRegistrationDeleteError,
    } = useMutation(RegistrationDeleteDocument)
    async function deleteRegistration(registrationId: number) {
      await registrationDelete({ registrationId })
    }
    onRegistrationDeleteDone(() => {
      $reset()
    })
    onRegistrationDeleteError((error) => {
      console.log(error)
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
