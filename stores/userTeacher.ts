import { defineStore } from 'pinia'
import { useFieldConfig } from '@/stores/useFieldConfig'
import {
  AllTeachersSearchDocument,
  TeacherCreateDocument,
  TeacherDeleteDocument,
  TeacherInfoDocument,
  TeacherUpdateDocument,
} from '~/graphql/gql/graphql'
import type {
  Teacher,
  TeacherCreateMutation,
  TeacherInput,
} from '~/graphql/gql/graphql'

export interface AllTeachers {
  id: number
  firstName: string
  lastName: string
  instrument: string
}

export const useTeacher = defineStore(
  'teacher',
  () => {
    const registrationStore = useRegistration()
    const appStore = useAppStore()
    const teacher = ref(<Teacher>{})
    const allTeachers = ref<AllTeachers[]>([])
    const fieldConfigStore = useFieldConfig()
    function $resetTeacher() {
      teacher.value = <Teacher>{}
    }
    function $resetAllTeachers() {
      teacher.value = <Teacher>{}
      allTeachers.value = <AllTeachers[]>[]
    }

    const teacherErrors = computed(() => {
      if (!!appStore.teacherHasPassword && appStore.performerType !== 'SCHOOL')
        return 0

      const teacherKeys = fieldConfigStore.performerTypeFields('Teacher')
      let count = 0
      for (const key of teacherKeys) {
        if (!!teacher.value[key as keyof Teacher] === false) {
          count++
        }
      }
      return count
    })

    /**
     * First name plus last name
     */
    const fullName = computed(() => {
      return `${teacher.value.firstName} ${teacher.value.lastName}`
    })

    /**
     * Adds Teacher object to store from db
     * @param teach Teacher Object must have valid id property value
     */
    function addToStore(teach: Teacher): void {
      teacher.value.id = teach.id
      teacher.value.firstName = teach.firstName || ''
      teacher.value.lastName = teach.lastName || ''
      teacher.value.privateTeacher = teach.privateTeacher || true
      teacher.value.schoolTeacher = teach.schoolTeacher || false
      teacher.value.apartment = teach.apartment || ''
      teacher.value.streetNumber = teach.streetNumber || ''
      teacher.value.streetName = teach.streetName || ''
      teacher.value.city = teach.city || 'Winnipeg'
      teacher.value.province = teach.province || 'MB'
      teacher.value.postalCode = teach.postalCode || ''
      teacher.value.email = teach.email || ''
      teacher.value.phone = teach.phone || ''
      teacher.value.instrument = teach.instrument || ''
      teacher.value.__typename = teach.__typename || 'Teacher'
    }

    /**
     * Creates a new Teacher record on the db and in the store. One
     * of the following params must be true.
     * @param privateTeacher boolean - Whether this is a private teacher
     * @param schoolTeacher boolean - Whether this is a school teacher
     * @returns Promise
     */

    const {
      mutate: teacherCreate,
      loading: teacherCreateLoading,
      onDone: onTeacherCreateDone,
      onError: onTeacherCreateError,
    } = useMutation(TeacherCreateDocument)
    async function createTeacher(
      privateTeacher: boolean,
      schoolTeacher: boolean
    ) {
      await teacherCreate({
        privateTeacher,
        schoolTeacher,
        teacherInput: <TeacherInput>{
          city: 'Winnipeg',
          province: 'MB',
        },
      })
    }
    onTeacherCreateDone((result) => {
      if (result.data?.teacherCreate.teacher) {
        const teacher: TeacherCreateMutation['teacherCreate']['teacher'] =
          result.data.teacherCreate.teacher
        addToStore(teacher)
      } else if (result.data?.teacherCreate.userErrors) {
        console.log(result.data?.teacherCreate.userErrors)
      }
    })
    onTeacherCreateError((error) => {
      console.log(error)
    })

    /**
     * Loads Teacher information from db into store.
     * @param teacherID teacher ID number
     * @returns Promise and teacher results
     */
    const {
      result: resultTeacher,
      load: teacherLoad,
      refetch: refetchTeacher,
      onError: onLoadTeacherError,
      onResult: onLoadTeacherResult,
    } = useLazyQuery(TeacherInfoDocument, undefined, {
      fetchPolicy: 'no-cache',
    })

    async function loadTeacher(teacherID?: number, teacherEmail?: string) {
      ;(await teacherLoad(null, { teacherID, teacherEmail })) ||
        (await refetchTeacher({ teacherID, teacherEmail }))
    }
    watch(resultTeacher, (newResult) => {
      if (newResult?.teacher) {
        addToStore(<Teacher>newResult.teacher)
      }
    })
    onLoadTeacherError((error) => {
      console.log(error)
    })

    /**
     * Loads all teacher information
     */
    const {
      result: resultTeachers,
      load: allTeachersLoad,
      refetch: refetchAllTeachers,
      onError: onTeachersLoadError,
      onResult: onTeachersResult,
    } = useLazyQuery(AllTeachersSearchDocument, undefined, {
      fetchPolicy: 'no-cache',
    })
    async function loadAllTeachers(
      privateTeacher: boolean,
      schoolTeacher: boolean
    ) {
      ;(await allTeachersLoad(null, { privateTeacher, schoolTeacher })) ||
        (await refetchAllTeachers({ privateTeacher, schoolTeacher }))
    }
    onTeachersResult((result) => {
      allTeachers.value = <AllTeachers[]>result.data.teachers.map((el) => el)
    })
    onTeachersLoadError((error) => {
      console.log(error)
    })

    /**
     * Updates the Teacher record from the store to the db.
     * @returns Promise
     */
    const {
      mutate: teacherUpdate,
      loading: teacherUpdateLoading,
      onDone: onTeacherUpdateDone,
      onError: onTeacherUpdateError,
    } = useMutation(TeacherUpdateDocument, {
      fetchPolicy: 'network-only',
    })
    async function updateTeacher(field?: string) {
      const { id, __typename, ...teachProps } = teacher.value
      let teacherField = null
      if (field && Object.keys(teachProps).includes(field)) {
        teacherField = Object.fromEntries(
          Array(Object.entries(teachProps).find((item) => item[0] === field)!)
        )
      }
      await teacherUpdate({
        teacherId: teacher.value.id,
        teacher: <TeacherInput>(teacherField || teachProps),
      })
    }
    onTeacherUpdateError((error) => {
      console.log(error)
    })

    /**
     * Removes a Teacher record from the db.
     * @param teacherId ID of Teacher record
     * @returns Promise
     */
    const {
      mutate: teacherDelete,
      loading: teacherDeleteLoading,
      onDone: onTeacherDeleteDone,
      onError: onTeacherDeleteError,
    } = useMutation(TeacherDeleteDocument)
    async function deleteTeacher(teacherId: number) {
      await teacherDelete({ teacherId })
    }
    onTeacherDeleteDone(() => {
      $resetTeacher()
    })
    onTeacherDeleteError((error) => {
      console.log(error)
    })

    /**
     * Loads Teacher information from db to check for a duplicate entry.
     * @param teacherID teacher ID number
     * @returns Promise and teacher results
     */

    const {
      result: resultTeacherDuplicate,
      load: loadTeacherDuplicate,
      refetch: refetchTeacherDuplicate,
      onError: onTeacherDuplicateError,
      onResult: onTeacherDuplicateResult,
    } = useLazyQuery(TeacherInfoDocument, undefined, {
      fetchPolicy: 'no-cache',
    })
    async function teacherDuplicateLoad(
      teacherID?: number,
      teacherEmail?: string
    ) {
      ;(await loadTeacherDuplicate(null, { teacherID, teacherEmail })) ||
        (await refetchTeacherDuplicate({ teacherID, teacherEmail }))
    }
    async function duplicateTeacherCheck(
      teacherEmail: string
    ): Promise<Teacher> {
      await teacherDuplicateLoad(undefined, teacherEmail)
      let duplicateTeacher = {} as Teacher
      onTeacherDuplicateResult((result) => {
        if (!result) {
          duplicateTeacher = {} as Teacher
        } else {
          console.log(result)
          duplicateTeacher = result.data.teacher
        }
      })
      return duplicateTeacher
    }
    onTeacherDuplicateError((error) => {
      console.log(error)
    })

    return {
      teacher,
      allTeachers,
      $resetTeacher,
      $resetAllTeachers,
      teacherErrors,
      deleteTeacher,
      updateTeacher,
      createTeacher,
      loadTeacher,
      loadAllTeachers,
      addToStore,
      fullName,
      duplicateTeacherCheck,
    }
  },
  {
    persist: true,
  }
)
