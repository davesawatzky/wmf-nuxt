import { usePerformers } from '@/stores/userPerformer'
import { useClasses } from '@/stores/userClasses'
import { useCommunity } from '@/stores/userCommunity'
import { useGroup } from '@/stores/userGroup'
import { useSchool } from '@/stores/userSchool'
import { useSchoolGroup } from '@/stores/userSchoolGroup'
import { useTeacher } from '@/stores/userTeacher'
import { useAppStore } from '@/stores/appStore'

const performerStore = usePerformers()
const classesStore = useClasses()
const communityStore = useCommunity()
const groupStore = useGroup()
const schoolStore = useSchool()
const schoolGroupStore = useSchoolGroup()
const teacherStore = useTeacher()
const appStore = useAppStore()
const tabName = ref({})

export const formErrors = computed(() => {
  switch (appStore.performerType) {
    case 'SOLO':
      tabName.value = {
        Performer: performerStore.performerErrors,
        Teacher: teacherStore.teacherErrors,
        'Solo Classes': classesStore.classErrors,
        Summary: 0,
      }
      break
    case 'GROUP':
      tabName.value = {
        Group: groupStore.groupErrors,
        Performers: performerStore.performerErrors,
        Teacher: teacherStore.teacherErrors,
        'Group Classes': classesStore.classErrors,
        Summary: 0,
      }
      break
    case 'SCHOOL':
      tabName.value = {
        School: schoolStore.schoolErrors,
        Teacher: teacherStore.teacherErrors,
        Groups: schoolGroupStore.schoolGroupErrors,
        'School Classes': classesStore.classErrors,
        Summary: 0,
      }
      break
    case 'COMMUNITY':
      tabName.value = {
        Community: communityStore.communityErrors,
        Contact: teacherStore.teacherErrors,
        'Community Classes': classesStore.classErrors,
        Summary: 0,
      }
      break
  }
  return tabName
})
