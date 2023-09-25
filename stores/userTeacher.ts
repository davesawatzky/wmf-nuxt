import { defineStore } from 'pinia'
import { useFieldConfig } from '@/stores/useFieldConfig'
import {
  TeacherCreateDocument,
  TeacherDeleteDocument,
  TeacherInfoDocument,
  TeacherUpdateDocument,
  TeachersDocument,
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
  __typename: 'Teacher'
}

export const useTeacher = defineStore(
  'teacher',
  () => {
    const teacher = ref(<Teacher>{})
    const allTeachers = ref<AllTeachers[]>([])
    const fieldConfigStore = useFieldConfig()
    function $resetTeacher() {
      teacher.value = <Teacher>{}
    }
    function $resetAllTeachers() {
      allTeachers.value = <AllTeachers[]>[]
    }

    const teacherErrors = computed(() => {
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
      teacher.value.prefix = teach.prefix || ''
      teacher.value.firstName = teach.firstName || ''
      teacher.value.lastName = teach.lastName || ''
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
     * Creates a new Teacher record on the db and in the store.
     * @returns Promise
     */
    function createTeacher(): Promise<unknown> {
      return new Promise((resolve, reject) => {
        const {
          mutate: teacherCreate,
          onDone,
          onError,
        } = useMutation(TeacherCreateDocument)
        teacherCreate({
          teacher: <TeacherInput>{
            city: 'Winnipeg',
            province: 'MB',
          },
        }).catch((error) => console.log(error))
        onDone((result) => {
          if (result.data?.teacherCreate.teacher) {
            const teacher: TeacherCreateMutation['teacherCreate']['teacher'] =
              result.data.teacherCreate.teacher
            addToStore(teacher)
            resolve('Success')
          } else if (result.data?.teacherCreate.userErrors) {
            reject(console.log(result.data?.teacherCreate.userErrors))
          }
        })
        onError((error) => {
          reject(console.log(error))
        })
      })
    }

    /**
     * Loads Teacher information from db into store.
     * @param teacherID teacher ID number
     * @returns Promise and teacher results
     */
    function loadTeacher(teacherID: number): Promise<unknown> {
      return new Promise((resolve, reject) => {
        const {
          result: resultTeachers,
          load,
          onError,
          onResult,
        } = useLazyQuery(
          TeacherInfoDocument,
          { teacherID },
          { fetchPolicy: 'network-only' }
        )
        load()
        onResult((result) => {
          addToStore(<Teacher>result.data.teacher)
          resolve('Success')
        })
        onError((error) => {
          reject(console.log(error))
        })
      })
    }

    function loadAllTeachers(): Promise<unknown> {
      return new Promise((resolve, reject) => {
        const { result, load, onError, onResult } = useLazyQuery(
          TeachersDocument,
          undefined,
          { fetchPolicy: 'network-only' }
        )
        load()
        onResult((result) => {
          allTeachers.value = <AllTeachers[]>(
            result.data.teachers.map((el) => el)
          )
          resolve('Success')
        })
        onError((error) => {
          reject(console.log(error))
        })
      })
    }

    /**
     * Updates the Teacher record from the store to the db.
     * @returns Promise
     */
    function updateTeacher(field?: string): Promise<unknown> {
      return new Promise((resolve, reject) => {
        const {
          mutate: teacherUpdate,
          onDone,
          onError,
        } = useMutation(TeacherUpdateDocument, {
          fetchPolicy: 'network-only',
        })
        const { id, __typename, ...teachProps } = teacher.value
        let teacherField = null
        if (field && Object.keys(teachProps).includes(field)) {
          teacherField = Object.fromEntries(
            Array(Object.entries(teachProps).find((item) => item[0] === field)!)
          )
        }
        teacherUpdate({
          teacherId: teacher.value.id,
          teacher: <TeacherInput>(teacherField || teachProps),
        }).catch((error) => console.log(error))
        onDone(() => {
          resolve('Success')
        })
        onError((error) => {
          reject(console.log(error))
        })
      })
    }

    /**
     * Removes a Teacher record from the db.
     * @param teacherId ID of Teacher record
     * @returns Promise
     */
    function deleteTeacher(teacherId: number): Promise<unknown> {
      return new Promise((resolve, reject) => {
        const {
          mutate: teacherDelete,
          onDone,
          onError,
        } = useMutation(TeacherDeleteDocument)
        teacherDelete({ teacherId }).catch((error) => console.log(error))
        onDone(() => {
          $resetTeacher()
          resolve('Success')
        })
        onError((error) => {
          reject(console.log(error))
        })
      })
    }
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
    }
  },
  {
    persist: true,
  }
)
