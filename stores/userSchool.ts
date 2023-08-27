import { useFieldConfig } from '@/stores/useFieldConfig'
import {
  SchoolCreateDocument,
  SchoolDeleteDocument,
  SchoolInfoDocument,
  SchoolUpdateDocument,
} from '~/graphql/gql/graphql'
import type {
  School,
  SchoolCreateMutation,
  SchoolInput,
} from '~/graphql/gql/graphql'

const fieldConfigStore = useFieldConfig()

export const useSchool = defineStore(
  'school',
  () => {
    const school = ref(<School>{})

    function $reset() {
      school.value = <School>{}
    }

    const schoolErrors = computed(() => {
      const schoolKeys = fieldConfigStore.performerTypeFields('School')
      let count = 0
      for (const key of schoolKeys) {
        if (!!school.value[key as keyof School] === false) {
          count++
        }
      }
      return count
    })
    /**
     * Adds School Object to the store. Only one
     * @param schl School object must have valid id property value
     */
    function addToStore(schl: Partial<School>) {
      school.value.id = schl.id!
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
          school: <SchoolInput>{
            city: 'Winnipeg',
            province: 'MB',
          },
        }).catch((error) => console.log(error))
        onDone((result) => {
          if (result.data?.schoolCreate.school) {
            const school: SchoolCreateMutation['schoolCreate']['school'] =
              result.data.schoolCreate.school
            addToStore(school)
            resolve('Success')
          } else if (result.data?.schoolCreate.userErrors) {
            console.log(result.data.schoolCreate.userErrors)
          }
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
          load,
          onResult,
          onError,
        } = useLazyQuery(
          SchoolInfoDocument,
          { registrationId },
          { fetchPolicy: 'network-only' }
        )
        load()
        onResult((result) => {
          addToStore(<School>result.data.registration.school)
          resolve('Success')
        })
        onError((error) => {
          reject(console.log(error))
        })
      })
    }

    /**
     * Updates School record in db from store.
     * @returns Promise
     */
    function updateSchool(field?: string): Promise<unknown> {
      return new Promise((resolve, reject) => {
        const {
          mutate: schoolUpdate,
          onDone,
          onError,
        } = useMutation(SchoolUpdateDocument, {
          fetchPolicy: 'network-only',
        })
        const { id, __typename, ...schoolProps } = school.value
        let schoolField = null
        if (field && Object.keys(schoolProps).includes(field)) {
          schoolField = Object.fromEntries(
            Array(
              Object.entries(schoolProps).find((item) => item[0] === field)!
            )
          )
        }
        schoolUpdate({
          schoolId: school.value.id,
          school: <SchoolInput>(schoolField || schoolProps),
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
      schoolErrors,
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
