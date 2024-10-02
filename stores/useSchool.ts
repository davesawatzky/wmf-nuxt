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

export const useSchool = defineStore(
  'school',
  () => {
    const school = ref(<School>{})
    const fieldConfigStore = useFieldConfig()
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
      school.value.address = schl.address || ''
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
    const {
      mutate: schoolCreate,
      loading: schoolCreateLoading,
      onDone: onSchoolCreateDone,
      onError: onSchoolCreateError,
    } = useMutation(SchoolCreateDocument)
    async function createSchool(registrationId: number) {
      await schoolCreate({
        registrationId,
        school: <SchoolInput>{
          city: 'Winnipeg',
          province: 'MB',
        },
      })
    }
    onSchoolCreateDone((result) => {
      if (result.data?.schoolCreate.school) {
        const school: SchoolCreateMutation['schoolCreate']['school'] =
          result.data.schoolCreate.school
        addToStore(school)
      } else if (result.data?.schoolCreate.userErrors) {
        console.log(result.data.schoolCreate.userErrors)
      }
    })
    onSchoolCreateError((error) => {
      console.log(error)
    })

    /**
     * Loads School information from db and adds it to the store.
     * @param registrationId ID of Registration Form
     */
    const {
      result: resultSchool,
      load: schoolLoad,
      refetch: refetchSchool,
      onResult: onLoadSchoolResult,
      onError: onLoadSchoolError,
    } = useLazyQuery(SchoolInfoDocument, undefined, {
      fetchPolicy: 'no-cache',
    })
    async function loadSchool(registrationId: number) {
      ;(await schoolLoad(null, { registrationId })) || (await refetchSchool())
    }
    watch(resultSchool, (newResult) => {
      if (newResult?.registration.school) {
        addToStore(<School>newResult.registration.school)
      }
    })
    onLoadSchoolError((error) => {
      console.log(error)
    })

    /**
     * Updates School record in db from store.
     * @returns Promise
     */
    const {
      mutate: schoolUpdate,
      loading: schoolUpdateLoading,
      onDone: onSchoolUpdateDone,
      onError: onSchoolUpdateError,
    } = useMutation(SchoolUpdateDocument, {
      fetchPolicy: 'network-only',
    })
    async function updateSchool(field?: string) {
      const { id, __typename, ...schoolProps } = school.value
      let schoolField = null
      if (field && Object.keys(schoolProps).includes(field)) {
        schoolField = Object.fromEntries(
          Array(Object.entries(schoolProps).find((item) => item[0] === field)!)
        )
      }
      await schoolUpdate({
        schoolId: school.value.id,
        school: <SchoolInput>(schoolField || schoolProps),
      })
    }
    onSchoolUpdateError((error) => {
      console.log(error)
    })

    /**
     * Removes the School record from the db.
     * @param schoolId ID of the School record
     */
    const {
      mutate: schoolDelete,
      loading: schoolDeleteLoading,
      onDone: onSchoolDeleteDone,
      onError: onSchoolDeleteError,
    } = useMutation(SchoolDeleteDocument)
    async function deleteSchool(schoolId: number) {
      await schoolDelete({ schoolId })
    }
    onSchoolDeleteDone(() => {
      $reset()
    })
    onSchoolDeleteError((error) => {
      console.log(error)
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
    }
  },
  {
    persist: true,
  }
)
