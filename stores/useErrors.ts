import { defineStore } from 'pinia'

export const useErrorStore = defineStore(
  'errorStore',
  () => {
    const errorField = ref({
      classErrors: 0,
      groupInfoErrors: 0,
      groupPerformersErrors: 0,
      groupTeacherErrors: 0,
      soloPerformerErrors: 0,
      soloTeacherErrors: 0,
      schoolInfoErrors: 0,
      schoolTeacherErrors: 0,
      schoolGroupErrors: 0,
      schoolGroupsErrors: 0,
      communityInfoErrors: 0,
      communityTeacherErrors: 0,
    })

    function $reset() {
      errorField.value.classErrors = 0
      errorField.value.groupInfoErrors = 0
      errorField.value.groupPerformersErrors = 0
      errorField.value.groupTeacherErrors = 0
      errorField.value.soloPerformerErrors = 0
      errorField.value.soloTeacherErrors = 0
      errorField.value.schoolInfoErrors = 0
      errorField.value.schoolTeacherErrors = 0
      errorField.value.schoolGroupErrors = 0
      errorField.value.schoolGroupsErrors = 0
      errorField.value.communityInfoErrors = 0
      errorField.value.communityTeacherErrors = 0
    }

    const numberOfErrors = computed(() => {
      return Object.values(errorField.value).reduce((a, b) => {
        return a + b
      }, 0)
    })

    return {
      $reset,
      errorField,
      numberOfErrors,
    }
  },
  {
    persist: true,
  }
)
