import { useFieldConfig } from '~/stores/useFieldConfig'
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
    const fieldConfigStore = useFieldConfig()
    const schoolGroup = ref<SchoolGroup[]>([])
    const schoolGroupErrors = ref<{ id: number; count: number }[]>([])

    /**
     * Resets the school group store to initial state
     */
    function $reset() {
      schoolGroup.value = []
      schoolGroupErrors.value = []
    }

    /**
     * Adds School Group store array
     * @param schoolGrp School Group Object must have valid id property value
     */
    function addToStore(schoolGrp: SchoolGroup): void {
      schoolGroup.value.push({
        id: schoolGrp.id,
        name: schoolGrp.name || null,
        groupSize:
          schoolGrp.groupSize !== null && schoolGrp.groupSize !== undefined
            ? schoolGrp.groupSize
            : null,
        chaperones:
          schoolGrp.chaperones !== null && schoolGrp.chaperones !== undefined
            ? schoolGrp.chaperones
            : null,
        wheelchairs:
          schoolGrp.wheelchairs !== null && schoolGrp.wheelchairs !== undefined
            ? schoolGrp.wheelchairs
            : null,
        earliestTime: schoolGrp.earliestTime || null,
        latestTime: schoolGrp.latestTime || null,
        unavailable: schoolGrp.unavailable || null,
        conflictPerformers: schoolGrp.conflictPerformers || null,
        photoPermission: schoolGrp.photoPermission || null,
        __typename: schoolGrp.__typename || 'SchoolGroup',
      })
      schoolGroupErrors.value.push({ id: schoolGrp.id, count: 0 })
    }

    function findInitialSchoolGroupErrors() {
      const schoolGroupKeys =
        fieldConfigStore.performerTypeFields('SchoolGroup')
      for (const group of schoolGroup.value) {
        let count = 0
        for (const key of schoolGroupKeys) {
          if (group[key as keyof SchoolGroup] === null) {
            count++
          }
        }
        const index = schoolGroupErrors.value.findIndex(
          (item) => item.id === group.id
        )
        schoolGroupErrors.value[index]!.count = count
      }
    }

    /**
     * Creates a school group record on the db and store
     * @param schoolId ID of School
     */
    const {
      mutate: schoolGroupCreate,
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
        console.error(
          'Failed to create school group:',
          result.data.schoolGroupCreate.userErrors
        )
      }
    })
    onSchoolGroupCreateError((error) => {
      console.error(error)
    })

    /**
     * Loads SchoolGroups from db into store.
     * @param registrationId ID of Registration Form
     */
    const {
      result: resultSchoolGroups,
      load: schoolGroupsLoad,
      refetch: refetchSchoolGroups,
      onError: onSchoolGroupsError,
    } = useLazyQuery(SchoolGroupInfoDocument, undefined, {
      fetchPolicy: 'no-cache',
    })
    async function loadSchoolGroups(registrationId: number) {
      const loaded = await schoolGroupsLoad(null, { registrationId })
      if (!loaded) {
        await refetchSchoolGroups()
      }
    }
    watch(resultSchoolGroups, (newResult) => {
      if (newResult?.registration.school?.schoolGroups) {
        const schoolGroups = newResult.registration.school
          .schoolGroups as SchoolGroup[]
        for (let i = 0; i < schoolGroups.length; i++) {
          addToStore(schoolGroups[i]!)
        }
        findInitialSchoolGroupErrors()
      }
    })
    onSchoolGroupsError((error) => {
      console.error(error)
    })

    /**
     * Updates individual school group information from store to db
     * @param schoolGroupId ID of registered School Group
     * @param field Optional field name to update
     */
    const { mutate: schoolGroupUpdate, onError: onSchoolGroupUpdateError } =
      useMutation(SchoolGroupUpdateDocument, {
        fetchPolicy: 'no-cache',
      })
    async function updateSchoolGroup(schoolGroupId: number, field?: string) {
      const schoolGrp = schoolGroup.value.find(
        (item) => item.id === schoolGroupId
      )
      if (!schoolGrp) {
        console.error('School group not found:', {
          operation: 'updateSchoolGroup',
          schoolGroupId,
        })
        return 'error'
      }

      const { id, __typename, ...schoolGroupProps } = schoolGrp
      let schoolGroupField = null
      if (field && Object.keys(schoolGroupProps).includes(field)) {
        schoolGroupField = Object.fromEntries(
          Array(
            Object.entries(schoolGroupProps).find((item) => item[0] === field)!
          )
        )
      }
      try {
        await schoolGroupUpdate({
          schoolGroupId,
          schoolGroup:
            schoolGroupField || (schoolGroupProps as SchoolGroupInput),
        })
        return 'complete'
      } catch (error) {
        console.error('Failed to update school group:', error)
        return 'error'
      }
    }
    onSchoolGroupUpdateError((error) => {
      console.error(error)
    })

    /**
     * Updates all School Group info to the db
     */
    async function updateAllSchoolGroups(): Promise<void> {
      for (let i = 0; i < schoolGroup.value.length; i++) {
        await updateSchoolGroup(schoolGroup.value[i]!.id)
      }
    }

    /**
     * Removes selected school group from the db and the school registration form
     * @param schoolGroupId ID of School Group
     */
    const { mutate: schoolGroupDelete, onError: onSchoolGroupDeleteError } =
      useMutation(SchoolGroupDeleteDocument)

    async function deleteSchoolGroup(schoolGroupId: number) {
      await schoolGroupDelete({ schoolGroupId })
      const index = schoolGroup.value.findIndex((e) => e.id === schoolGroupId)
      if (index !== -1) {
        schoolGroup.value.splice(index, 1)
        schoolGroupErrors.value.splice(index, 1)
      } else {
        console.error('School group not found for deletion:', {
          operation: 'deleteSchoolGroup',
          schoolGroupId,
        })
      }
    }
    onSchoolGroupDeleteError((error) => {
      console.error(error)
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
