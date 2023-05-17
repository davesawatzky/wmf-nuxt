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
    // registrationId: '',
    const teacherInfo = ref(<Teacher>{})

    function $reset() {
      teacherInfo.value = <Teacher>{}
    }

    const fullName = computed(() => {
      return teacherInfo.value.firstName && ' ' && teacherInfo.value.lastName
    })

    function addToStore(teacher: Teacher) {
      teacherInfo.value = teacher
    }

    async function createTeacher(registrationId: number) {
      const {
        mutate: teacherCreate,
        onDone: doneTeacherCreate,
        onError,
      } = useMutation(TeacherCreateDocument)
      const clone = Object.assign({}, teacherInfo.value)
      delete clone.id
      await teacherCreate({
        registrationId,
        teacher: clone,
      })
      doneTeacherCreate((result) => {
        teacherInfo.value.id = result.data.teacherCreate.teacher.id
      })
      onError((error) => {
        console.log(error)
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

    // async function loadTeacher(registrationId: number) {
    //   return await new Promise((resolve, reject) => {
    //     const { onError, onResult: resultLoadTeacher } = useQuery(
    //       TeacherInfoDocument,
    //       { registrationId },
    //       { fetchPolicy: 'network-only' }
    //     )
    //     resultLoadTeacher((result) => {
    //       const clone = Object.assign({}, result.data.registration.teacher)
    //       delete clone.__typename
    //       addToStore(clone)
    //       resolve(result)
    //     })
    //     onError((error) => {
    //       reject(error)
    //     })
    //   })
    // }

    async function updateTeacher() {
      const { mutate: teacherUpdate, onError } = useMutation(
        TeacherUpdateDocument,
        {
          fetchPolicy: 'network-only',
        }
      )
      // TODO:check if the typescript typing actually removes the id from teacherInfo
      // const clone = Object.assign({}, <TeacherInput>teacherInfo.value)
      // delete clone.id
      await teacherUpdate({
        teacherId: teacherInfo.value.id,
        teacher: <TeacherInput>teacherInfo.value,
      })
      onError((error) => {
        console.log(error)
      })
    }

    async function deleteTeacher(teacherId: number) {
      const { mutate: teacherDelete, onError } = useMutation(
        TeacherDeleteDocument
      )
      await teacherDelete({ teacherId })
      onError((error) => {
        console.log(error)
      })
    }
    return {
      teacherInfo,
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
