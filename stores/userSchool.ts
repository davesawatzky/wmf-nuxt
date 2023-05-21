import {
  SchoolCreateDocument,
  SchoolDeleteDocument,
  SchoolInfoDocument,
  SchoolUpdateDocument,
} from '~/graphql/gql/graphql'
import type { School } from '~/graphql/gql/graphql'

export const useSchool = defineStore(
  'school',
  () => {
    const school = ref(<School>{})

    function $reset() {
      school.value = <School>{}
    }

    function addToStore(schoolId: School['id']) {
      school.value.id = schoolId
      school.value.division = ''
      school.value.name = ''
      school.value.streetNumber = ''
      school.value.streetName = ''
      school.value.city = 'Winnipeg'
      school.value.province = 'MB'
      school.value.postalCode = ''
      school.value.phone = ''
      school.value.__typename = 'School'
    }

    async function createSchool(registrationId: number) {
      return await new Promise((resolve, reject) => {
        const {
          mutate: schoolCreate,
          onDone,
          onError,
        } = useMutation(SchoolCreateDocument)
        schoolCreate({
          registrationId,
          schoolInput: <School>{
            city: 'Winnipeg',
            province: 'MB',
          },
        }).catch((error) => console.log(error))
        onDone((result) => {
          const schoolId: number = result.data.schoolCreate.school.index
          addToStore(schoolId)
          resolve('Success')
        })
        onError((error) => {
          reject(console.log(error))
        })
      })
    }

    function loadSchool(registrationId: number) {
      const {
        result: resultSchool,
        load: loadSchool,
        onResult: resultLoadSchool,
        onError,
      } = useLazyQuery(
        SchoolInfoDocument,
        { registrationId },
        { fetchPolicy: 'network-only' }
      )
      resultLoadSchool((result) => {
        addToStore(<School>result.data.registration.school)
      })
      onError((error) => {
        console.log(error)
      })
      return {
        resultSchool,
        loadSchool,
      }
    }

    async function updateSchool() {
      const { mutate: schoolUpdate, onError } = useMutation(
        SchoolUpdateDocument,
        {
          fetchPolicy: 'network-only',
        }
      )
      const clone = Object.assign({}, school.value)
      delete clone.id
      delete clone.__typename
      await schoolUpdate({
        schoolId: school.value.id,
        school: clone,
      })
      onError((error) => {
        console.log(error)
      })
    }

    async function deleteSchool(schoolId: number) {
      const { mutate: schoolDelete, onError } =
        useMutation(SchoolDeleteDocument)
      await schoolDelete({ schoolId })
      onError((error) => {
        console.log(error)
      })
    }

    return {
      deleteSchool,
      $reset,
      updateSchool,
      loadSchool,
      createSchool,
      school,
      addToStore,
    }
  },
  {
    persist: true,
  }
)
