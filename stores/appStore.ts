import { defineStore } from 'pinia'

enum EnumPerformerType {
  'SOLO',
  'GROUP',
  'SCHOOL',
  'COMMUNITY',
}

export const useAppStore = defineStore(
  'appStore',
  () => {
    const editExisting = ref(false) // edits an existing registration from the db
    const performerType = ref<keyof typeof EnumPerformerType>('SOLO') // default performerType - just in case.
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

    function $reset() {
      editExisting.value = false
      performerType.value = 'SOLO'
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
    }
  },
  {
    persist: true,
  }
)
