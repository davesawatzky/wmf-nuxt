import { defineStore } from 'pinia'
import { useFieldConfig } from '@/stores/useFieldConfig'
import {
  TeacherCreateDocument,
  TeacherDeleteDocument,
  TeacherInfoDocument,
  TeacherUpdateDocument,
  AllTeachersSearchDocument,
} from '~/graphql/gql/graphql'
import type {
  TeacherCreateMutation,
  TeacherInput,
  Teacher,
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
      if (
        !!appStore.teacherHasPassword &&
        appStore.performerType !== 'SCHOOL'
      ) {
        return 0
      }
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
    function createTeacher(
      privateTeacher: boolean,
      schoolTeacher: boolean
    ): Promise<unknown> {
      return new Promise((resolve, reject) => {
        const {
          mutate: teacherCreate,
          onDone,
          onError,
        } = useMutation(TeacherCreateDocument)
        teacherCreate({
          privateTeacher,
          schoolTeacher,
          teacherInput: <TeacherInput>{
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

    function loadAllTeachers(
      privateTeacher: boolean,
      schoolTeacher: boolean
    ): Promise<unknown> {
      return new Promise((resolve, reject) => {
        const { result, load, onError, onResult } = useLazyQuery(
          AllTeachersSearchDocument,
          { privateTeacher, schoolTeacher },
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

    /**
     * Loads Teacher information from db to check for a duplicate entry.
     * @param teacherID teacher ID number
     * @returns Promise and teacher results
     */
    function duplicateTeacherCheck(teacherEmail: string): Promise<Teacher> {
      return new Promise((resolve, reject) => {
        const {
          result: resultTeacher,
          load,
          onError,
          onResult,
        } = useLazyQuery(
          TeacherInfoDocument,
          { teacherID: null, teacherEmail },
          { fetchPolicy: 'network-only' }
        )
        load()
        onResult((result) => {
          if (!result) {
            reject('no duplicate')
          } else {
            console.log(result)
            resolve(result.data.teacher)
          }
        })
        onError((error) => {
          console.log(error)
          reject('no duplicate')
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
      duplicateTeacherCheck,
    }
  },
  {
    persist: true,
  }
)
