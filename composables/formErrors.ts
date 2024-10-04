interface FormErrors {
  [key: string]: number
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
        'Solo Classes': classesStore.classErrors,
        Summary: 0,
      }
      break
    case 'GROUP':
      tabName.value = {
        Group: groupStore.groupErrors,
        Performers: performerStore.performerErrors.reduce(
          (a, b) => a + b.count,
          0
        ),
        Teacher: teacherStore.teacherErrors,
        'Group Classes': classesStore.classErrors,
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
        'School Classes': classesStore.classErrors,
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
        'Community Classes': classesStore.classErrors,
        Summary: 0,
      }
      break
  }
  return tabName
})
