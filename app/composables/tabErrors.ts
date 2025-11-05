interface TabErrors {
  [key: string]: number
}

interface ErrorObject {
  count?: number
  selections?: ErrorObject[]
  [key: string]: number | ErrorObject[] | undefined
}

export function sumErrorsArray(arr: ErrorObject[]): number {
  let sum = 0
  arr.forEach((obj: ErrorObject) => {
    for (const key in obj) {
      if (key === 'selections') {
        sum += sumErrorsArray(obj[key] as ErrorObject[])
      } else if (key === 'count') {
        sum += obj.count ?? 0
      }
    }
  })
  return sum
}

export function useTabErrors(): ComputedRef<TabErrors> {
  // Initialize stores within the composable function to ensure Pinia is ready
  const performerStore = usePerformers()
  const classesStore = useClasses()
  const communityStore = useCommunity()
  const communityGroupStore = useCommunityGroup()
  const groupStore = useGroup()
  const schoolStore = useSchool()
  const schoolGroupStore = useSchoolGroup()
  const teacherStore = useTeacher()
  const appStore = useAppStore()

  return computed<TabErrors>(() => {
    let tabName: TabErrors

    switch (appStore.performerType) {
      case 'SOLO':
        tabName = {
          Performer: performerStore.totalPerformerErrors,
          Teacher: teacherStore.teacherErrors,
          'Solo Classes': sumErrorsArray(classesStore.classErrors),
          Summary: 0,
        }
        break
      case 'GROUP':
        tabName = {
          Group: groupStore.groupErrors,
          Performers: performerStore.totalPerformerErrors,
          Teacher: teacherStore.teacherErrors,
          'Group Classes': sumErrorsArray(classesStore.classErrors),
          Summary: 0,
        }
        break
      case 'SCHOOL':
        tabName = {
          School: schoolStore.schoolErrors,
          Teacher: teacherStore.teacherErrors,
          Groups: schoolGroupStore.schoolGroupErrors.reduce(
            (a, b) => a + b.count,
            0
          ),
          'School Classes': sumErrorsArray(classesStore.classErrors),
          Summary: 0,
        }
        break
      case 'COMMUNITY':
        tabName = {
          Community: communityStore.communityErrors,
          Contact: teacherStore.teacherErrors,
          Groups: communityGroupStore.communityGroupErrors.reduce(
            (a, b) => a + b.count,
            0
          ),
          'Community Classes': sumErrorsArray(classesStore.classErrors),
          Summary: 0,
        }
        break
      default:
        tabName = {}
    }
    return tabName
  })
}
