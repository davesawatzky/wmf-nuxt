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
    const fieldConfigStore = useFieldConfig()
    const fieldStatusRef = ref<{ stat: string; field: string }>()
    const teacher = ref<Partial<Teacher>>(createEmptyTeacher())
    const allTeachers = ref<AllTeachers[]>([])
    const emailAlreadyExists = ref(false)
    const chosenTeacher = ref<FilteredTeacher>(createEmptyFilteredTeacher())
    const duplicateCheck = ref<Teacher | null>(null)
    const teacherCreated = ref(false)
    const unlistedTeacher = ref(false)
    const runRemovalHook = ref(true)

    /**
     * Factory function to create an empty teacher object with default values
     */
    function createEmptyTeacher(): Partial<Teacher> {
      return {
        id: 0,
        firstName: null,
        lastName: null,
        privateTeacher: true,
        schoolTeacher: false,
        address: null,
        city: 'Winnipeg',
        province: 'MB',
        postalCode: null,
        email: null,
        phone: null,
        instrument: null,
        __typename: 'Teacher',
      }
    }

    /**
     * Factory function to create an empty filtered teacher object
     */
    function createEmptyFilteredTeacher(): FilteredTeacher {
      return null
    }

    /**
     * Resets the teacher store to initial state
     */
    function $resetTeacher() {
      teacher.value = createEmptyTeacher()
    }

    /**
     * Resets both teacher and all teachers to initial state
     */
    function $resetAllTeachers() {
      teacher.value = createEmptyTeacher()
      allTeachers.value = []
    }

    /**
     * Resets the chosen teacher to initial state
     */
    function $resetChosenTeacher() {
      chosenTeacher.value = createEmptyFilteredTeacher()
    }

    /**
     * Computed teacher errors - automatically tracks teacher state changes
     * Reactive in Pinia DevTools and always in sync with actual data
     */
    const teacherErrors = computed(() => {
      // Check if 'No Teacher' is selected - this means no teacher is required
      if (
        chosenTeacher.value?.firstName === 'Teacher' &&
        chosenTeacher.value?.lastName === 'No'
      ) {
        return 0
      }

      // No teacher or default "Unlisted" teacher means 1 error (no teacher selected)
      if (!teacher.value.id || teacher.value.id === 2) {
        return 1
      }

      // For unlisted teachers being created, check all required fields
      if (unlistedTeacher.value) {
        const teacherKeys = fieldConfigStore.performerTypeFields('Teacher')
        let count = 0

        for (const key of teacherKeys) {
          const value = teacher.value[key as keyof Teacher]
          // Count missing, null, or empty required fields
          if (!value || value === null || value === '') {
            count++
          }
        }
        return count
      }
      return 0
    })

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
      teacher.value = {
        id: teach.id,
        firstName: teach.firstName || null,
        lastName: teach.lastName || null,
        privateTeacher: teach.privateTeacher ?? true,
        schoolTeacher: teach.schoolTeacher ?? false,
        address: teach.address || null,
        city: teach.city || 'Winnipeg',
        province: teach.province || 'MB',
        postalCode: teach.postalCode || null,
        email: teach.email || null,
        phone: teach.phone || null,
        instrument: teach.instrument || null,
        __typename: teach.__typename || 'Teacher',
      }
    }

    /**
     * Creates a new Teacher record on the db and in the store. One
     * of the following params must be true.
     * @param privateTeacher boolean - Whether this is a private teacher
     * @param schoolTeacher boolean - Whether this is a school teacher
     */
    const { mutate: teacherCreate, onDone: onTeacherCreateDone } = useMutation(
      TeacherCreateDocument,
      {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
      }
    )
    async function createTeacher(
      privateTeacher: boolean,
      schoolTeacher: boolean
    ) {
      await teacherCreate({
        privateTeacher,
        schoolTeacher,
        teacherInput: {
          city: 'Winnipeg',
          province: 'MB',
        } as TeacherInput,
      })
    }
    onTeacherCreateDone((result) => {
      if (result.data?.teacherCreate.teacher) {
        const teacher: TeacherCreateMutation['teacherCreate']['teacher'] =
          result.data.teacherCreate.teacher
        addToStore(teacher)
      } else if (result.data?.teacherCreate.userErrors) {
        console.error(
          'Failed to create teacher:',
          result.data.teacherCreate.userErrors
        )
      }
    })
    const teacherId = computed(() => teacher.value.id)

    /**
     * Loads Teacher information from db into store.
     * @param teacherID teacher ID number
     * @param teacherEmail teacher email address
     */
    const {
      result: resultTeacher,
      load: teacherLoad,
      refetch: refetchTeacher,
      onError: onLoadTeacherError,
    } = useLazyQuery(TeacherInfoDocument, undefined, {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    })
    async function loadTeacher(teacherID?: number, teacherEmail?: string) {
      const loaded = await teacherLoad(null, { teacherID, teacherEmail })
      if (!loaded) {
        await refetchTeacher({ teacherID, teacherEmail })
      }
    }
    watch(resultTeacher, (newResult) => {
      if (newResult?.teacher) {
        addToStore(newResult.teacher as Teacher)
      }
    })
    onLoadTeacherError((error) => {
      console.error(error)
    })

    /**
     * Loads all teacher information
     * @param teacherType Type of teacher ('privateTeacher' or 'schoolTeacher')
     */
    const {
      load: allTeachersLoad,
      refetch: refetchAllTeachers,
      onError: onTeachersLoadError,
      onResult: onTeachersResult,
    } = useLazyQuery(AllTeachersSearchDocument, undefined, {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    })
    async function loadAllTeachers(
      teacherType: 'privateTeacher' | 'schoolTeacher'
    ) {
      const loaded = await allTeachersLoad(null, { teacherType })
      if (!loaded) {
        await refetchAllTeachers({ teacherType })
      }
    }
    onTeachersResult((result) => {
      allTeachers.value = result.data.teachers.map((el) => el) as AllTeachers[]
    })
    onTeachersLoadError((error) => {
      console.error(error)
    })

    /**
     * Updates the Teacher record from the store to the db.
     * @param field Optional specific field to update
     * @returns Promise resolving to 'complete' or 'error'
     */
    const { mutate: teacherUpdate, onError: onTeacherUpdateError } =
      useMutation(TeacherUpdateDocument, {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
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
          teacherId: teacher.value.id!,
          teacher: teacherField || (teachProps as TeacherInput),
        })
        return 'complete'
      } catch (error) {
        console.error('Failed to update teacher:', error, {
          operation: 'updateTeacher',
          field,
          teacherId: teacher.value.id,
        })
        return 'error'
      }
    }
    onTeacherUpdateError((error) => {
      console.error(error)
    })

    /**
     * Removes a Teacher record from the db.
     * @param teacherId ID of Teacher record
     */
    const {
      mutate: teacherDelete,
      onDone: onTeacherDeleteDone,
      onError: onTeacherDeleteError,
    } = useMutation(TeacherDeleteDocument)
    async function deleteTeacher(teacherId: number) {
      try {
        await teacherDelete({ teacherId })
      } catch (error) {
        console.error('Failed to delete teacher:', error, {
          operation: 'deleteTeacher',
          teacherId,
        })
        throw error
      }
    }
    onTeacherDeleteDone(() => {
      $resetTeacher()
    })
    onTeacherDeleteError((error) => {
      console.error('Failed to delete teacher:', error, {
        operation: 'deleteTeacher',
      })
    })

    /**
     * Loads Teacher information from db to check for a duplicate entry.
     * @param teacherID teacher ID number
     * @param teacherEmail teacher email address
     */
    const {
      result: resultTeacherDuplicate,
      load: loadTeacherDuplicate,
      refetch: refetchTeacherDuplicate,
      onError: onTeacherDuplicateError,
    } = useLazyQuery(TeacherInfoDocument, undefined, {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    })

    async function teacherDuplicateLoad(
      teacherID?: number,
      teacherEmail?: string
    ) {
      const loaded = await loadTeacherDuplicate(null, {
        teacherID,
        teacherEmail,
      })
      if (!loaded) {
        await refetchTeacherDuplicate({ teacherID, teacherEmail })
      }
    }
    async function duplicateTeacherCheck(
      teacherEmail: string
    ): Promise<Teacher | null> {
      await teacherDuplicateLoad(undefined, teacherEmail)
      return resultTeacherDuplicate.value?.teacher ?? null
    }

    onTeacherDuplicateError((error) => {
      console.error('Teacher duplicate check failed:', error, {
        operation: 'duplicateTeacherCheck',
      })
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
        } else if (unlistedTeacher.value && teacher.value.id) {
          // TypeScript guard: id is checked above, so it's safe to assert as number
          const teacherId = teacher.value.id as number
          chosenTeacher.value = {
            id: teacherId,
            firstName: teacher.value.firstName!,
            lastName: teacher.value.lastName!,
            phone: teacher.value.phone!,
            email: teacher.value.email!,
          }
        }
        unlistedTeacher.value = false
        teacherCreated.value = false
      } catch (error) {
        console.error('Failed to remove unlisted teacher:', error, {
          operation: 'removeUnlistedTeacher',
        })
      }
    }

    async function removeUnlistedTeacherOnDeactivate() {
      try {
        if (runRemovalHook.value) {
          await removeUnlistedTeacher()
        }
      } catch (error) {
        console.error(
          'Failed to remove unlisted teacher on deactivate:',
          error,
          {
            operation: 'removeUnlistedTeacherOnDeactivate',
          }
        )
      }
    }

    async function removeUnlistedTeacherBeforeUnmount() {
      runRemovalHook.value = false
      try {
        await removeUnlistedTeacher()
      } catch (error) {
        console.error(
          'Failed to remove unlisted teacher before unmount:',
          error,
          {
            operation: 'removeUnlistedTeacherBeforeUnmount',
          }
        )
      }
    }

    async function removeTeacherFromDatabaseAndRegistration() {
      try {
        if (teacher.value.id && teacher.value.id !== 2) {
          // TypeScript guard: id is checked above, so it's safe to assert as number
          const teacherId = teacher.value.id as number
          await deleteTeacher(teacherId)
        }
      } catch (error) {
        console.error('Failed to remove teacher from database:', error, {
          operation: 'removeTeacherFromDatabaseAndRegistration',
          teacherId: teacher.value.id,
        })
      }
    }

    return {
      teacher,
      teacherId,
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
