import {
  SchoolCreateDocument,
  SchoolDeleteDocument,
  SchoolInfoDocument,
  SchoolUpdateDocument,
} from '~/graphql/gql/graphql'
import type { School, SchoolInput } from '~/graphql/gql/graphql'

export const useSchool = defineStore(
  'school',
  () => {
    const school = ref(<School>{})

    function $reset() {
      school.value = <School>{}
    }

    /**
     * Adds School Object to the store. Only one
     * @param schl School object must have valid id property value
     */
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

    /**
     * Creates new School in db and adds it to the store
     * @param registrationId ID of Registration Form
     * @returns Promise
     */
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

    /**
     * Loads School information from db and adds it to the store.
     * @param registrationId ID of Registration Form
     * @returns
     */
    function loadSchool(registrationId: number) {
      return new Promise((resolve, reject) => {
        const {
          result: resultSchool,
          load: loadSchool,
          onResult,
          onError,
        } = useLazyQuery(
          SchoolInfoDocument,
          { registrationId },
          { fetchPolicy: 'network-only' }
        )
        onResult((result) => {
          addToStore(<School>result.data.registration.school)
          resolve('Success')
        })
        onError((error) => {
          reject(console.log(error))
        })
        return {
          resultSchool,
          loadSchool,
        }
      })
    }

    /**
     * Updates School record in db from store.
     * @returns Promise
     */
    function updateSchool() {
      return new Promise((resolve, reject) => {
        const {
          mutate: schoolUpdate,
          onDone,
          onError,
        } = useMutation(SchoolUpdateDocument, {
          fetchPolicy: 'network-only',
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, __typename, ...schl } = school.value
        schoolUpdate({
          schoolId: school.value.id,
          school: <SchoolInput>schl,
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
     * Removes the School record from the db.
     * @param schoolId ID of the School record
     * @returns
     */
    function deleteSchool(schoolId: number) {
      return new Promise((resolve, reject) => {
        const {
          mutate: schoolDelete,
          onDone,
          onError,
        } = useMutation(SchoolDeleteDocument)
        schoolDelete({ schoolId }).catch((error) => console.log(error))
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
