import { defineStore } from 'pinia'
import {
  TeacherCreateDocument,
  TeacherDeleteDocument,
  TeacherInfoDocument,
  TeacherUpdateDocument,
} from '~/graphql/gql/graphql'
import type { Teacher, TeacherInput } from '~/graphql/gql/graphql'

export const useTeacher = defineStore(
  'teacher',
  () => {
    const teacher = ref(<Teacher>{})

    function $reset() {
      teacher.value = <Teacher>{}
    }

    /**
     * First name plus last name
     */
    const fullName = computed(() => {
      return teacher.value.firstName && ' ' && teacher.value.lastName
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
      teacher.value.__typename = teach.__typename || 'Teacher'
    }

    /**
     * Creates a new Teacher record on the db and in the store.
     * @param registrationId ID of Registration form
     * @returns
     */
    function createTeacher(registrationId: number): Promise<unknown> {
      return new Promise((resolve, reject) => {
        const {
          mutate: teacherCreate,
          onDone,
          onError,
        } = useMutation(TeacherCreateDocument)
        teacherCreate({
          registrationId,
          teacher: <TeacherInput>{
            city: 'Winnipeg',
            province: 'MB',
          },
        }).catch((error) => console.log(error))
        onDone((result) => {
          const teacher: Teacher = result.data.teacherCreate.teacher
          addToStore(teacher)
          resolve('Success')
        })
        onError((error) => {
          reject(console.log(error))
        })
      })
    }

    /**
     * Loads Teacher information from db into store.
     * @param registrationId ID of Registration Form
     * @returns
     */
    function loadTeacher(registrationId: number): Promise<unknown> {
      return new Promise((resolve, reject) => {
        const {
          result: resultTeachers,
          load,
          onError,
          onResult,
        } = useLazyQuery(
          TeacherInfoDocument,
          { registrationId },
          { fetchPolicy: 'network-only' }
        )
        load()
        onResult((result) => {
          // if ( result.data.registration.teacher !== null ) {
          addToStore(<Teacher>result.data.registration.teacher)
          // } else {
          //   createTeacher(registrationId).catch((error) => console.log(error))
          // }
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
    function updateTeacher(): Promise<unknown> {
      return new Promise((resolve, reject) => {
        const {
          mutate: teacherUpdate,
          onDone,
          onError,
        } = useMutation(TeacherUpdateDocument, {
          fetchPolicy: 'network-only',
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, __typename, ...teach } = teacher.value
        teacherUpdate({
          teacherId: teacher.value.id,
          teacher: <TeacherInput>teach,
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
     * @returns
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
          $reset()
          resolve('Success')
        })
        onError((error) => {
          reject(console.log(error))
        })
      })
    }
    return {
      teacher,
      $reset,
      deleteTeacher,
      updateTeacher,
      createTeacher,
      loadTeacher,
      addToStore,
      fullName,
    }
  },
  {
    persist: true,
  }
)
