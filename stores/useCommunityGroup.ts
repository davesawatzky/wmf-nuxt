import { useFieldConfig } from '@/stores/useFieldConfig'
import { number } from 'yup'
import {
  CommunityGroupCreateDocument,
  CommunityGroupDeleteDocument,
  CommunityGroupInfoDocument,
  CommunityGroupUpdateDocument,
} from '~/graphql/gql/graphql'
import type {
  CommunityGroup,
  CommunityGroupCreateMutation,
  CommunityGroupInput,
} from '~/graphql/gql/graphql'

export const useCommunityGroup = defineStore(
  'communityGroup',
  () => {
    const communityGroup = ref([] as CommunityGroup[])
    const fieldConfigStore = useFieldConfig()
    const communityGroupErrors = ref<{ id: number; count: number }[]>([])

    function $reset() {
      communityGroup.value.splice(0, communityGroup.value.length)
      communityGroupErrors.value.splice(0, communityGroupErrors.value.length)
    }

    /**
     * Adds Community Group store array
     * @param communityGrp Community Group Object must have valid id property value
     */
    function addToStore(communityGrp: CommunityGroup): void {
      communityGroup.value.push({
        id: communityGrp.id,
        name: communityGrp.name || null,
        groupSize:
          communityGrp.groupSize !== null &&
          communityGrp.groupSize !== undefined
            ? communityGrp.groupSize
            : null,
        chaperones:
          communityGrp.chaperones !== null &&
          communityGrp.chaperones !== undefined
            ? communityGrp.chaperones
            : null,
        wheelchairs:
          communityGrp.wheelchairs !== null &&
          communityGrp.wheelchairs !== undefined
            ? communityGrp.wheelchairs
            : null,
        earliestTime: communityGrp.earliestTime || null,
        latestTime: communityGrp.latestTime || null,
        unavailable: communityGrp.unavailable || null,
        conflictPerformers: communityGrp.conflictPerformers || null,
        photoPermission: communityGrp.photoPermission || null,
        __typename: communityGrp.__typename || 'CommunityGroup',
      })
      communityGroupErrors.value.push({ id: communityGrp.id, count: 0 })
    }

    function findInitialCommunityGroupErrors() {
      const communityGroupKeys =
        fieldConfigStore.performerTypeFields('CommunityGroup')
      for (const group of communityGroup.value) {
        let count = 0
        for (const key of communityGroupKeys) {
          if (group[key as keyof CommunityGroup] === null) {
            count++
          }
        }
        let index = communityGroupErrors.value.findIndex(
          (item) => item.id === group.id
        )
        communityGroupErrors.value[index].count = count
      }
    }

    /**
     * Creates a community group record on the db and store
     * @param communityId ID of Community
     */

    const {
      mutate: communityGroupCreate,
      loading: loadingCommunityGroupCreate,
      onDone: onCommunityGroupCreateDone,
      onError: onCommunityGroupCreateError,
    } = useMutation(CommunityGroupCreateDocument, {
      fetchPolicy: 'no-cache',
    })
    async function createCommunityGroup(communityId: number) {
      await communityGroupCreate({ communityId })
    }
    onCommunityGroupCreateDone((result) => {
      if (result.data?.communityGroupCreate.communityGroup) {
        const communityGroup: CommunityGroupCreateMutation['communityGroupCreate']['communityGroup'] =
          result.data.communityGroupCreate.communityGroup
        addToStore(communityGroup)
      } else if (result.data?.communityGroupCreate.userErrors) {
        console.log(result.data.communityGroupCreate.userErrors)
      }
    })
    onCommunityGroupCreateError((error) => {
      console.log(error)
    })

    /**
     * Loads CommunityGroups from db into store.
     * @param registrationId ID of Registration Form
     */

    const {
      result: resultCommunityGroups,
      load: communityGroupsLoad,
      refetch: refetchCommunityGroups,
      onResult: onCommunityGroupsResult,
      onError: onCommunityGroupsError,
    } = useLazyQuery(CommunityGroupInfoDocument, undefined, {
      fetchPolicy: 'no-cache',
    })
    async function loadCommunityGroups(registrationId: number) {
      ;(await communityGroupsLoad(null, { registrationId })) ||
        (await refetchCommunityGroups())
    }
    watch(resultCommunityGroups, (newResult) => {
      if (newResult?.registration.community?.communityGroups) {
        const communityGroups = <CommunityGroup[]>(
          newResult.registration.community?.communityGroups
        )
        for (let i = 0; i < communityGroups.length; i++) {
          addToStore(communityGroups[i])
        }
        findInitialCommunityGroupErrors()
      }
    })
    onCommunityGroupsError((error) => {
      console.log(error)
    })

    /**
     * Updates individual community group information from store to db
     * @param communityGroupId ID of registered Community Group
     * @param field optional field name to update.
     */
    const {
      mutate: communityGroupUpdate,
      loading: loadingCommunityGroupUpdate,
      onDone: onCommunityGroupUpdateDone,
      onError: onCommunityGroupUpdateError,
    } = useMutation(CommunityGroupUpdateDocument, {
      fetchPolicy: 'no-cache',
    })
    async function updateCommunityGroup(
      communityGroupId: number,
      field?: string
    ) {
      const communityGrp = <CommunityGroup>communityGroup.value.find((item) => {
        return item.id === communityGroupId
      })
      const { id, __typename, ...schlgrpProps } = communityGrp
      let communityGroupField = null
      if (field && Object.keys(schlgrpProps).includes(field)) {
        communityGroupField = Object.fromEntries(
          Array(Object.entries(schlgrpProps).find((item) => item[0] === field)!)
        )
      }
      try {
        await communityGroupUpdate({
          communityGroupId,
          communityGroup: <CommunityGroupInput>(
            (communityGroupField || schlgrpProps)
          ),
        })
        return 'complete'
      } catch (e) {
        console.log(e)
        return 'error'
      }
    }
    onCommunityGroupUpdateError((error) => {
      console.log(error)
    })

    /**
     * Updates all Community Group info to the db
     */
    async function updateAllCommunityGroups(): Promise<void> {
      for (let i = 0; i < communityGroup.value.length; i++)
        await updateCommunityGroup(communityGroup.value[i].id)
    }

    /**
     * Removes selected community group from the db and the community registration form
     * @param communityGroupId ID of Community Group
     */
    const {
      mutate: communityGroupDelete,
      loading: loadingCommunityGroupDelete,
      onDone: onCommunityGroupDeleteDone,
      onError: onCommunityGroupDeleteError,
    } = useMutation(CommunityGroupDeleteDocument)
    async function deleteCommunityGroup(communityGroupId: number) {
      await communityGroupDelete({ communityGroupId })
      const index = communityGroup.value.findIndex(
        (e) => e.id === communityGroupId
      )
      communityGroup.value.splice(index, 1)
      communityGroupErrors.value.splice(index, 1)
    }
    onCommunityGroupDeleteError((error) => {
      console.log(error)
    })

    return {
      $reset,
      communityGroupErrors,
      deleteCommunityGroup,
      updateCommunityGroup,
      communityGroup,
      updateAllCommunityGroups,
      addToStore,
      createCommunityGroup,
      loadCommunityGroups,
      findInitialCommunityGroupErrors,
    }
  },
  {
    persist: true,
  }
)
