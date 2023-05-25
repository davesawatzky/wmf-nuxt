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

    const fullName = computed(() => {
      return teacher.value.firstName && ' ' && teacher.value.lastName
    })

    function addToStore(teach: Teacher) {
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

    function createTeacher(registrationId: number) {
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

    function loadTeacher(registrationId: number) {
      const {
        result: resultTeachers,
        load: loadTeachers,
        onError: teacherError,
        onResult: resultLoadTeachers,
      } = useLazyQuery(
        TeacherInfoDocument,
        { registrationId },
        { fetchPolicy: 'network-only' }
      )
      resultLoadTeachers((result) => {
        addToStore(<Teacher>result.data.registration.teacher)
      })
      teacherError((error) => {
        console.log(error)
      })
      return {
        resultTeachers,
        loadTeachers,
      }
    }

    async function updateTeacher() {
      const { mutate: teacherUpdate, onError } = useMutation(
        TeacherUpdateDocument,
        {
          fetchPolicy: 'network-only',
        }
      )
      await teacherUpdate({
        teacherId: teacher.value.id,
        teacher: <TeacherInput>teacher.value,
      })
      onError((error) => {
        console.log(error)
      })
    }

    function deleteTeacher(teacherId: number) {
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
