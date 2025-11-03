import { useFieldConfig } from '~/stores/useFieldConfig'
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

export const useSchool = defineStore(
  'school',
  () => {
    const fieldConfigStore = useFieldConfig()
    const schoolErrors = ref(0)

    /**
     * Factory function to create an empty school object with default values
     */
    function createEmptySchool(): Partial<School> {
      return {
        id: 0,
        division: null,
        name: null,
        address: null,
        city: 'Winnipeg',
        province: 'MB',
        postalCode: null,
        phone: null,
        __typename: 'School',
      }
    }

    const school = ref<Partial<School>>(createEmptySchool())

    /**
     * Resets the school store to initial state
     */
    function $reset() {
      school.value = createEmptySchool()
      schoolErrors.value = 0
    }

    /**
     * Adds School Object to the store. Only one
     * @param schl School object must have valid id property value
     */
    function addToStore(schl: Partial<School>) {
      school.value = {
        id: schl.id!,
        division: schl.division || null,
        name: schl.name || null,
        address: schl.address || null,
        city: schl.city || 'Winnipeg',
        province: schl.province || 'MB',
        postalCode: schl.postalCode || null,
        phone: schl.phone || null,
        __typename: schl.__typename || 'School',
      }
    }

    /**
     * Counts missing required fields for school validation
     */
    function findInitialSchoolErrors() {
      const schoolKeys = fieldConfigStore.performerTypeFields('School')
      let count = 0
      for (const key of schoolKeys) {
        if (school.value[key as keyof School] === null) {
          count++
        }
      }
      schoolErrors.value = count
    }

    /**
     * Creates new School in db and adds it to the store
     * @param registrationId ID of Registration Form
     */
    const {
      mutate: schoolCreate,
      onDone: onSchoolCreateDone,
      onError: onSchoolCreateError,
    } = useMutation(SchoolCreateDocument, {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    })

    async function createSchool(registrationId: number) {
      await schoolCreate({
        registrationId,
        school: {
          city: 'Winnipeg',
          province: 'MB',
        } as SchoolInput,
      })
    }

    onSchoolCreateDone((result) => {
      if (result.data?.schoolCreate.school) {
        const school: SchoolCreateMutation['schoolCreate']['school'] =
          result.data.schoolCreate.school
        addToStore(school)
      } else if (result.data?.schoolCreate.userErrors) {
        console.error(
          'School creation failed:',
          result.data.schoolCreate.userErrors,
          {
            operation: 'createSchool',
          }
        )
      }
    })

    onSchoolCreateError((error) => {
      console.error('Failed to create school:', error, {
        operation: 'createSchool',
      })
    })

    /**
     * Loads School information from db and adds it to the store
     * @param registrationId ID of Registration Form
     */
    const {
      result: resultSchool,
      load: schoolLoad,
      refetch: refetchSchool,
      onError: onLoadSchoolError,
    } = useLazyQuery(SchoolInfoDocument, undefined, {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    })

    async function loadSchool(registrationId: number) {
      const loaded = await schoolLoad(null, { registrationId })
      if (!loaded) {
        await refetchSchool()
      }
    }

    watch(resultSchool, (newResult) => {
      if (newResult?.registration.school) {
        addToStore(newResult.registration.school as School)
        findInitialSchoolErrors()
      }
    })

    onLoadSchoolError((error) => {
      console.error('Failed to load school:', error, {
        operation: 'loadSchool',
      })
    })

    /**
     * Updates School record in db from store
     * @param field Optional specific field to update
     * @returns Promise resolving to 'complete' or 'error'
     */
    const { mutate: schoolUpdate, onError: onSchoolUpdateError } = useMutation(
      SchoolUpdateDocument,
      {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      }
    )

    async function updateSchool(field?: string) {
      const { id, __typename, ...schoolProps } = school.value
      let schoolField = null

      if (field && Object.keys(schoolProps).includes(field)) {
        schoolField = Object.fromEntries(
          Array(Object.entries(schoolProps).find((item) => item[0] === field)!)
        )
      }

      try {
        await schoolUpdate({
          schoolId: school.value.id!,
          school: schoolField || (schoolProps as SchoolInput),
        })
        return 'complete'
      } catch (error) {
        console.error('Failed to update school:', error, {
          operation: 'updateSchool',
          field,
          schoolId: school.value.id,
        })
        return 'error'
      }
    }

    onSchoolUpdateError((error) => {
      console.error('School update error:', error, {
        operation: 'updateSchool',
      })
    })

    /**
     * Removes the School record from the db
     * @param schoolId ID of the School record
     */
    const {
      mutate: schoolDelete,
      onDone: onSchoolDeleteDone,
      onError: onSchoolDeleteError,
    } = useMutation(SchoolDeleteDocument)

    async function deleteSchool(schoolId: number) {
      try {
        await schoolDelete({ schoolId })
      } catch (error) {
        console.error('Failed to delete school:', error, {
          operation: 'deleteSchool',
          schoolId,
        })
        throw error
      }
    }

    onSchoolDeleteDone(() => {
      $reset()
    })

    onSchoolDeleteError((error) => {
      console.error('School deletion error:', error, {
        operation: 'deleteSchool',
      })
    })

    return {
      deleteSchool,
      $reset,
      schoolErrors,
      updateSchool,
      loadSchool,
      createSchool,
      school,
      addToStore,
      findInitialSchoolErrors,
    }
  },
  {
    persist: true,
  }
)
