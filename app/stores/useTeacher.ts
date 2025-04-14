import { defineStore } from 'pinia'
import { useFieldConfig } from '~/stores/useFieldConfig'
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
import { string } from 'yup'

export interface AllTeachers {
  id: number
  firstName: string
  lastName: string
  instrument: string
}

export type FilteredTeacher = {
  id: number
  firstName: string
  lastName: string
  phone?: string
  email?: string
} | null

export const useTeacher = defineStore(
  'teacher',
  () => {
    const registrationStore = useRegistration()
    const appStore = useAppStore()
    const teacher = ref(<Teacher>{})
    const allTeachers = ref<AllTeachers[]>([])
    const fieldConfigStore = useFieldConfig()
    const teacherErrors = ref(0)

    const emailAlreadyExists = ref(false)
    const chosenTeacher = ref({} as FilteredTeacher)
    const duplicateCheck = ref({} as Teacher | null)
    const teacherCreated = ref(false)
    const unlistedTeacher = ref(false)
    const runRemovalHook = ref(true)
    const fieldStatusRef = ref<{ stat: string; field: string }>()

    function $resetTeacher() {
      teacher.value = <Teacher>{}
      teacherErrors.value = 0
    }
    function $resetAllTeachers() {
      teacher.value = <Teacher>{}
      allTeachers.value.splice(0, allTeachers.value.length)
      teacherErrors.value = 0
    }

    function $resetChosenTeacher() {
      chosenTeacher.value = <FilteredTeacher>{}
    }

    /**
     * First name plus last name
     */
    const fullName = computed(() => {
      if (teacher.value.lastName === 'Unlisted' || teacher.value.id === 2) {
        return `${teacher.value.lastName} ${teacher.value.firstName}`
      } else {
        return `${teacher.value.firstName} ${teacher.value.lastName}`
      }
    })

    /**
     * Adds Teacher object to store from db
     * @param teach Teacher Object must have valid id property value
     */
    function addToStore(teach: Teacher): void {
      teacher.value.id = teach.id
      teacher.value.firstName = teach.firstName || null
      teacher.value.lastName = teach.lastName || null
      teacher.value.privateTeacher = teach.privateTeacher || true
      teacher.value.schoolTeacher = teach.schoolTeacher || false
      teacher.value.address = teach.address || null
      teacher.value.city = teach.city || 'Winnipeg'
      teacher.value.province = teach.province || 'MB'
      teacher.value.postalCode = teach.postalCode || null
      teacher.value.email = teach.email || null
      teacher.value.phone = teach.phone || null
      teacher.value.instrument = teach.instrument || null
      teacher.value.__typename = teach.__typename || 'Teacher'
    }

    function findInitialTeacherErrors() {
      const teacherKeys = fieldConfigStore.performerTypeFields('Teacher')
      let count = 0
      for (const key of teacherKeys) {
        if (teacher.value[key as keyof Teacher] === null) {
          count++
        }
      }
      teacherErrors.value = count
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
      teacherType: 'privateTeacher' | 'schoolTeacher'
    ) {
      ;(await allTeachersLoad(null, { teacherType })) ||
        (await refetchAllTeachers({ teacherType }))
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
      try {
        await teacherUpdate({
          teacherId: teacher.value.id,
          teacher: <TeacherInput>(teacherField || teachProps),
        })
        return 'complete'
      } catch (error) {
        console.log(error)
        return 'error'
      }
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
      console.log('Running teacherDuplicateLoad', teacherID, teacherEmail)
      ;(await loadTeacherDuplicate(null, { teacherID, teacherEmail })) ||
        (await refetchTeacherDuplicate({ teacherID, teacherEmail }))
    }
    async function duplicateTeacherCheck(
      teacherEmail: string
    ): Promise<Teacher | null> {
      await teacherDuplicateLoad(undefined, teacherEmail)
      console.log('resultTeacherDuplicate', resultTeacherDuplicate.value)
      return resultTeacherDuplicate.value?.teacher ?? null
    }
    onTeacherDuplicateResult((result) => {
      console.log("If not null then there's a duplicate entry.", result.data)
    })
    onTeacherDuplicateError((error) => {
      console.log(error)
    })

    async function removeUnlistedTeacher() {
      try {
        if (
          (!teacher.value.email ||
            !teacher.value.phone ||
            !teacher.value.firstName ||
            !teacher.value.lastName) &&
          !!teacherCreated.value
        ) {
          await removeTeacherFromDatabaseAndRegistration()
          fieldStatusRef.value = {
            stat: 'remove',
            field: 'id',
          }
          chosenTeacher.value = null
          emailAlreadyExists.value = false
        } else if (unlistedTeacher.value) {
          chosenTeacher.value = {
            id: teacher.value.id,
            firstName: teacher.value.firstName!,
            lastName: teacher.value.lastName!,
            phone: teacher.value.phone!,
            email: teacher.value.email!,
          }
        }
        unlistedTeacher.value = false
        teacherCreated.value = false
      } catch (error) {
        console.log(error)
      }
    }

    async function removeUnlistedTeacherOnDeactivate() {
      try {
        if (runRemovalHook.value) {
          await removeUnlistedTeacher()
        }
      } catch (error) {
        console.log(error)
      }
    }

    async function removeUnlistedTeacherBeforeUnmount() {
      runRemovalHook.value = false
      try {
        await removeUnlistedTeacher()
      } catch (error) {
        console.log(error)
      }
    }

    async function removeTeacherFromDatabaseAndRegistration() {
      try {
        if (teacher.value.id !== 2) {
          console.log('Removing teacher', teacher.value.id)
          await deleteTeacher(teacher.value.id)
        }
      } catch (error) {
        console.log(error)
      }
    }

    return {
      teacher,
      allTeachers,
      $resetTeacher,
      $resetAllTeachers,
      $resetChosenTeacher,
      teacherErrors,
      deleteTeacher,
      updateTeacher,
      createTeacher,
      loadTeacher,
      loadAllTeachers,
      addToStore,
      fullName,
      duplicateTeacherCheck,
      findInitialTeacherErrors,
      removeUnlistedTeacherOnDeactivate,
      removeUnlistedTeacherBeforeUnmount,
      emailAlreadyExists,
      chosenTeacher,
      duplicateCheck,
      teacherCreated,
      unlistedTeacher,
      removeTeacherFromDatabaseAndRegistration,
      fieldStatusRef,
      runRemovalHook,
    }
  },
  {
    persist: true,
  }
)
