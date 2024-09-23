import { defineStore } from 'pinia'
import { PerformerType } from '~/graphql/gql/graphql'

export const useAppStore = defineStore(
  'appStore',
  () => {
    const editExisting = ref(false) // edits an existing registration from the db
    const performerType = ref<PerformerType>(PerformerType.SOLO) // default performerType - just in case.
    const registrationExists = ref(false) // registration exists in the db
    const performerContactLoaded = ref(false) // performer contact already exists and is loaded
    const groupInfoLoaded = ref(false)
    const schoolInfoLoaded = ref(false)
    const communityInfoLoaded = ref(false)
    const teacherInfoLoaded = ref(false) // teacher contact already exists and is loaded
    const classExists = ref(false) // registered class is fully loaded into class form
    const selectionExists = ref(false) // registered selection is fully loaded into class form
    const classContentLoaded = ref(false) // Existing class content is loaded from db
    const dataLoading = ref(false)
    const teacherHasPassword = ref(false)
    const stripePayment = ref('')
    const passwordResetSent = ref(false)
    const processingFee = ref('')
    const stripeTokenId = ref()

    function $reset() {
      editExisting.value = false
      performerType.value = PerformerType.SOLO
      registrationExists.value = false
      performerContactLoaded.value = false
      groupInfoLoaded.value = false
      schoolInfoLoaded.value = false
      communityInfoLoaded.value = false
      teacherInfoLoaded.value = false
      classExists.value = false
      selectionExists.value = false
      classContentLoaded.value = false
      dataLoading.value = false
      teacherHasPassword.value = false
      stripePayment.value = 'cash'
      passwordResetSent.value = false
      processingFee.value = ''
      stripeTokenId.value = ''
    }

    return {
      $reset,
      editExisting,
      performerType,
      registrationExists,
      performerContactLoaded,
      groupInfoLoaded,
      schoolInfoLoaded,
      communityInfoLoaded,
      teacherInfoLoaded,
      classExists,
      selectionExists,
      classContentLoaded,
      dataLoading,
      teacherHasPassword,
      stripePayment,
      passwordResetSent,
      processingFee,
      stripeTokenId,
    }
  },
  {
    persist: true,
  }
)
