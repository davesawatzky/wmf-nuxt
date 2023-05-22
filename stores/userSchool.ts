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

    function addToStore(schl: School) {
      school.value.id = schl.id
      school.value.division = schl.division || ''
      school.value.name = schl.name || ''
      school.value.streetNumber = schl.streetNumber || ''
      school.value.streetName = schl.streetName || ''
      school.value.city = schl.city || 'Winnipeg'
      school.value.province = schl.province || 'MB'
      school.value.postalCode = schl.postalCode || ''
      school.value.phone = schl.phone || ''
      school.value.__typename = schl.__typename || 'School'
    }

    function createSchool(registrationId: number) {
      return new Promise((resolve, reject) => {
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
          const school: School = result.data.schoolCreate.school
          addToStore(school)
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
