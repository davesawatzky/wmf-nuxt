import { useFieldConfig } from '@/stores/useFieldConfig'
import {
  SchoolGroupCreateDocument,
  SchoolGroupDeleteDocument,
  SchoolGroupInfoDocument,
  SchoolGroupUpdateDocument,
} from '~/graphql/gql/graphql'
import type {
  SchoolGroup,
  SchoolGroupCreateMutation,
  SchoolGroupInput,
} from '~/graphql/gql/graphql'

const fieldConfigStore = useFieldConfig()

export const useSchoolGroup = defineStore(
  'schoolGroup',
  () => {
    const schoolGroup = ref([] as SchoolGroup[])

    function $reset() {
      schoolGroup.value = <SchoolGroup[]>[]
    }

    const schoolGroupErrors = computed(() => {
      const schoolGroupKeys =
        fieldConfigStore.performerTypeFields('SchoolGroup')
      let count = 0
      for (const group of schoolGroup.value) {
        for (const key of schoolGroupKeys) {
          if (!!group[key as keyof SchoolGroup] === false) {
            count++
          }
        }
      }
      return count
    })

    /**
     * Adds School Group store array
     * @param schoolGrp School Group Object must have valid id property value
     */
    function addToStore(schoolGrp: SchoolGroup): void {
      schoolGroup.value.push({
        id: schoolGrp.id,
        name: schoolGrp.name || '',
        groupSize: schoolGrp.groupSize || undefined,
        chaperones: schoolGrp.chaperones || undefined,
        wheelchairs: schoolGrp.wheelchairs || undefined,
        earliestTime: schoolGrp.earliestTime || '',
        latestTime: schoolGrp.latestTime || '',
        unavailable: schoolGrp.unavailable || '',
        conflictPerformers: schoolGrp.conflictPerformers || '',
        __typename: schoolGrp.__typename || 'SchoolGroup',
      })
    }

    /**
     * Creates a school group record on the db and store
     * @param schoolId ID of School
     * @returns Promise
     */
    function createSchoolGroup(schoolId: number): Promise<unknown> {
      return new Promise((resolve, reject) => {
        const {
          mutate: schoolGroupCreate,
          onDone,
          onError,
        } = useMutation(SchoolGroupCreateDocument, {
          fetchPolicy: 'no-cache',
        })
        schoolGroupCreate({ schoolId }).catch((error) => console.log(error))
        onDone((result) => {
          if (result.data?.schoolGroupCreate.schoolGroup) {
            const schoolGroup: SchoolGroupCreateMutation['schoolGroupCreate']['schoolGroup'] =
              result.data.schoolGroupCreate.schoolGroup
            addToStore(schoolGroup)
            resolve('Success')
          } else if (result.data?.schoolGroupCreate.userErrors) {
            console.log(result.data.schoolGroupCreate.userErrors)
          }
        })
        onError((error) => {
          reject(console.log(error))
        })
      })
    }

    /**
     * Loads SchoolGroups from db into store.
     * @param registrationId ID of Registration Form
     * @returns
     */
    function loadSchoolGroups(registrationId: number): Promise<unknown> {
      return new Promise((resolve, reject) => {
        const {
          result: resultSchoolGroups,
          load,
          onResult,
          onError,
        } = useLazyQuery(
          SchoolGroupInfoDocument,
          { registrationId },
          { fetchPolicy: 'no-cache' }
        )
        load()
        onResult((result) => {
          const schoolGroups = <SchoolGroup[]>(
            result.data.registration.school?.schoolGroups
          )
          for (let i = 0; i < schoolGroups.length; i++) {
            addToStore(schoolGroups[i])
          }
          resolve('Success')
        })
        onError((error) => {
          reject(console.log(error))
        })
      })
    }

    /**
     * Updates individual school group information from store to db
     * @param schoolGroupId ID of registered School Group
     * @param field optional field name to update.
     * @returns Promise
     */
    function updateSchoolGroup(
      schoolGroupId: number,
      field?: string
    ): Promise<unknown> {
      return new Promise((resolve, reject) => {
        const {
          mutate: schoolGroupUpdate,
          onDone,
          onError,
        } = useMutation(SchoolGroupUpdateDocument, {
          fetchPolicy: 'no-cache',
        })
        const schoolGrp = <SchoolGroup>schoolGroup.value.find((item) => {
          return item.id === schoolGroupId
        })
        const { id, __typename, ...schlgrpProps } = schoolGrp
        let schoolGroupField = null
        if (field && Object.keys(schlgrpProps).includes(field)) {
          schoolGroupField = Object.fromEntries(
            Array(
              Object.entries(schlgrpProps).find((item) => item[0] === field)!
            )
          )
        }
        console.log(schlgrpProps)
        schoolGroupUpdate({
          schoolGroupId,
          schoolGroup: <SchoolGroupInput>(schoolGroupField || schlgrpProps),
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
     * Updates all School Group info to the db
     */
    async function updateAllSchoolGroups(): Promise<void> {
      for (let i = 0; i < schoolGroup.value.length; i++) {
        await updateSchoolGroup(schoolGroup.value[i].id)
      }
    }

    /**
     * Removes selected school group from the db and the school registration form
     * @param schoolGroupId ID of School Group
     * @returns Promise
     */
    function deleteSchoolGroup(schoolGroupId: number): Promise<unknown> {
      return new Promise((resolve, reject) => {
        const {
          mutate: schoolGroupDelete,
          onDone,
          onError,
        } = useMutation(SchoolGroupDeleteDocument)
        schoolGroupDelete({ schoolGroupId }).catch((error) =>
          console.log(error)
        )
        onDone(() => {
          const index = schoolGroup.value.findIndex(
            (e) => e.id === schoolGroupId
          )
          schoolGroup.value.splice(index, 1)
          resolve('Success')
        })
        onError((error) => {
          reject(console.log(error))
        })
      })
    }

    return {
      $reset,
      schoolGroupErrors,
      deleteSchoolGroup,
      updateSchoolGroup,
      schoolGroup,
      updateAllSchoolGroups,
      addToStore,
      createSchoolGroup,
      loadSchoolGroups,
    }
  },
  {
    persist: true,
  }
)
