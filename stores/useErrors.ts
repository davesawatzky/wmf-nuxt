import { defineStore } from 'pinia'

export const useErrorStore = defineStore(
  'errorStore',
  () => {
    const classErrors = ref(0)
    const groupInfoErrors = ref(0)
    const groupPerformersErrors = ref(0)
    const groupTeacherErrors = ref(0)
    const soloPerformerErrors = ref(0)
    const soloTeacherErrors = ref(0)
    const schoolInfoErrors = ref(0)
    const schoolTeacherErrors = ref(0)
    const schoolGroupErrors = ref(0)
    const schoolGroupsErrors = ref(0)
    const communityInfoErrors = ref(0)
    const communityTeacherErrors = ref(0)

    function $reset() {
      classErrors.value = 0
      groupInfoErrors.value = 0
      groupPerformersErrors.value = 0
      groupTeacherErrors.value = 0
      soloPerformerErrors.value = 0
      soloTeacherErrors.value = 0
      schoolInfoErrors.value = 0
      schoolTeacherErrors.value = 0
      schoolGroupErrors.value = 0
      schoolGroupsErrors.value = 0
      communityInfoErrors.value = 0
      communityTeacherErrors.value = 0
    }

    const numberOfErrors = computed(() => {
      const total =
        classErrors.value +
        groupInfoErrors.value +
        groupPerformersErrors.value +
        groupTeacherErrors.value +
        soloPerformerErrors.value +
        soloTeacherErrors.value +
        schoolInfoErrors.value +
        schoolTeacherErrors.value +
        schoolGroupErrors.value +
        schoolGroupsErrors.value +
        communityInfoErrors.value +
        communityTeacherErrors.value
      return total
    })

    return {
      $reset,
      classErrors,
      groupInfoErrors,
      groupPerformersErrors,
      groupTeacherErrors,
      soloPerformerErrors,
      soloTeacherErrors,
      schoolInfoErrors,
      schoolTeacherErrors,
      schoolGroupErrors,
      schoolGroupsErrors,
      communityInfoErrors,
      communityTeacherErrors,
      numberOfErrors,
    }
  },
  {
    persist: true,
  }
)
