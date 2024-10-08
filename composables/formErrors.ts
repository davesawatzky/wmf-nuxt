import { b } from 'vitest/dist/chunks/suite.BMWOKiTe.js'
import type { ClassErrors } from '~/utils/types'

interface FormErrors {
  [key: string]: number
}

export function sumErrorsArray(arr: any) {
  let sum = 0
  arr.forEach((obj: any) => {
    for (const key in obj) {
      if (key === 'selections') {
        sum += sumErrorsArray(obj[key])
      } else if (key === 'count') {
        sum += obj.count
      }
    }
  })
  return sum
}

export const formErrors = computed(() => {
  const performerStore = usePerformers()
  const classesStore = useClasses()
  const communityStore = useCommunity()
  const communityGroupStore = useCommunityGroup()
  const groupStore = useGroup()
  const schoolStore = useSchool()
  const schoolGroupStore = useSchoolGroup()
  const teacherStore = useTeacher()
  const appStore = useAppStore()
  const tabName = ref({} as FormErrors)

  switch (appStore.performerType) {
    case 'SOLO':
      tabName.value = {
        Performer: performerStore.performerErrors[0].count,
        Teacher: teacherStore.teacherErrors,
        'Solo Classes': classesStore.totalClassErrors,
        Summary: 0,
      }
      break
    case 'GROUP':
      tabName.value = {
        Group: groupStore.groupErrors,
        Performers: performerStore.totalPerformerErrors,
        Teacher: teacherStore.teacherErrors,
        'Group Classes': classesStore.totalClassErrors,
        Summary: 0,
      }
      break
    case 'SCHOOL':
      tabName.value = {
        School: schoolStore.schoolErrors,
        Teacher: teacherStore.teacherErrors,
        Groups: schoolGroupStore.schoolGroupErrors.reduce(
          (a, b) => a + b.count,
          0
        ),
        'School Classes': classesStore.totalClassErrors,
        Summary: 0,
      }
      break
    case 'COMMUNITY':
      tabName.value = {
        Community: communityStore.communityErrors,
        Contact: teacherStore.teacherErrors,
        Groups: communityGroupStore.communityGroupErrors.reduce(
          (a, b) => a + b.count,
          0
        ),
        'Community Classes': classesStore.totalClassErrors,
        Summary: 0,
      }
      break
  }
  return tabName
})
