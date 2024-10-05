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

export const useSchoolGroup = defineStore(
  'schoolGroup',
  () => {
    const schoolGroup = ref([] as SchoolGroup[])
    const fieldConfigStore = useFieldConfig()
    const schoolGroupErrors = ref<{ id: number; count: number }[]>([])
    function $reset() {
      schoolGroup.value.splice(0, schoolGroup.value.length)
      schoolGroupErrors.value.splice(0, schoolGroupErrors.value.length)
    }

    /**
     * Adds School Group store array
     * @param schoolGrp School Group Object must have valid id property value
     */
    function addToStore(schoolGrp: SchoolGroup): void {
      try {
        schoolGroup.value.push({
          id: schoolGrp.id,
          name: schoolGrp.name || null,
          groupSize: schoolGrp.groupSize !== null ? schoolGrp.groupSize : null,
          chaperones: schoolGrp.chaperones !== null ? schoolGrp.chaperones : null,
          wheelchairs: schoolGrp.wheelchairs !== null ? schoolGrp.wheelchairs : null,
          earliestTime: schoolGrp.earliestTime || null,
          latestTime: schoolGrp.latestTime || null,
          unavailable: schoolGrp.unavailable || null,
          conflictPerformers: schoolGrp.conflictPerformers || null,
          photoPermission: schoolGrp.photoPermission || null,
          __typename: schoolGrp.__typename || 'SchoolGroup',
        })
        schoolGroupErrors.value.push( {id: schoolGrp.id, count: 0} )
        console.log(schoolGroup.value)
      } catch (err) {
        console.log(err)
      }
    }

    function findInitialSchoolGroupErrors() {
      const schoolGroupKeys =
        fieldConfigStore.performerTypeFields('SchoolGroup')
      for (const group of schoolGroup.value) {
        let count = 0
        for (const key of schoolGroupKeys) {
          if (group[key as keyof SchoolGroup] === null) {
            count++
            console.log(key, group[key as keyof SchoolGroup])
          }
        }
        let index = schoolGroupErrors.value.findIndex(
          (item) => item.id === group.id
        )
        schoolGroupErrors.value[index].count = count
      }
    }

    /**
     * Creates a school group record on the db and store
     * @param schoolId ID of School
     */

    const {
      mutate: schoolGroupCreate,
      loading: loadingSchoolGroupCreate,
      onDone: onSchoolGroupCreateDone,
      onError: onSchoolGroupCreateError,
    } = useMutation(SchoolGroupCreateDocument, {
      fetchPolicy: 'no-cache',
    })
    async function createSchoolGroup(schoolId: number) {
      await schoolGroupCreate({ schoolId })
    }
    onSchoolGroupCreateDone((result) => {
      if (result.data?.schoolGroupCreate.schoolGroup) {
        const schoolGroup: SchoolGroupCreateMutation['schoolGroupCreate']['schoolGroup'] =
          result.data.schoolGroupCreate.schoolGroup
        addToStore(schoolGroup)
      } else if (result.data?.schoolGroupCreate.userErrors) {
        console.log(result.data.schoolGroupCreate.userErrors)
      }
    })
    onSchoolGroupCreateError((error) => {
      console.log(error)
    })

    /**
     * Loads SchoolGroups from db into store.
     * @param registrationId ID of Registration Form
     */

    const {
      result: resultSchoolGroups,
      load: schoolGroupsLoad,
      refetch: refetchSchoolGroups,
      onResult: onSchoolGroupsResult,
      onError: onSchoolGroupsError,
    } = useLazyQuery(SchoolGroupInfoDocument, undefined, {
      fetchPolicy: 'no-cache',
    })
    async function loadSchoolGroups(registrationId: number) {
      ;(await schoolGroupsLoad(null, { registrationId })) ||
        (await refetchSchoolGroups())
    }
    watch(resultSchoolGroups, (newResult) => {
      if (newResult?.registration.school?.schoolGroups) {
        const schoolGroups = <SchoolGroup[]>(
          newResult.registration.school?.schoolGroups
        )
        const length = schoolGroups.length
        for (let i = 0; i < length; i++) addToStore(schoolGroups[i])
        findInitialSchoolGroupErrors()
      }
    })
    onSchoolGroupsError((error) => {
      console.log(error)
    })

    /**
     * Updates individual school group information from store to db
     * @param schoolGroupId ID of registered School Group
     * @param field optional field name to update.
     */
    const {
      mutate: schoolGroupUpdate,
      loading: loadingSchoolGroupUpdate,
      onDone: onSchoolGroupUpdateDone,
      onError: onSchoolGroupUpdateError,
    } = useMutation(SchoolGroupUpdateDocument, {
      fetchPolicy: 'no-cache',
    })
    async function updateSchoolGroup(schoolGroupId: number, field?: string) {
      const schoolGrp = <SchoolGroup>schoolGroup.value.find((item) => {
        return item.id === schoolGroupId
      })
      const { id, __typename, ...schlgrpProps } = schoolGrp
      let schoolGroupField = null
      if (field && Object.keys(schlgrpProps).includes(field)) {
        schoolGroupField = Object.fromEntries(
          Array(Object.entries(schlgrpProps).find((item) => item[0] === field)!)
        )
      }
      await schoolGroupUpdate({
        schoolGroupId,
        schoolGroup: <SchoolGroupInput>(schoolGroupField || schlgrpProps),
      })
    }
    onSchoolGroupUpdateError((error) => {
      console.log(error)
    })

    /**
     * Updates all School Group info to the db
     */
    async function updateAllSchoolGroups() {
      for (let i = 0; i < schoolGroup.value.length; i++)
        await updateSchoolGroup(schoolGroup.value[i].id)
    }

    /**
     * Removes selected school group from the db and the school registration form
     * @param schoolGroupId ID of School Group
     */
    const {
      mutate: schoolGroupDelete,
      loading: loadingSchoolGroupDelete,
      onDone: onSchoolGroupDeleteDone,
      onError: onSchoolGroupDeleteError,
    } = useMutation(SchoolGroupDeleteDocument)

    async function deleteSchoolGroup(schoolGroupId: number) {
      await schoolGroupDelete({ schoolGroupId })
      const index = schoolGroup.value.findIndex((e) => e.id === schoolGroupId)
      schoolGroup.value.splice(index, 1)
      schoolGroupErrors.value.splice(index, 1)
    }
    onSchoolGroupDeleteError((error) => {
      console.log(error)
    })

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
      findInitialSchoolGroupErrors,
    }
  },
  {
    persist: true,
  }
)
