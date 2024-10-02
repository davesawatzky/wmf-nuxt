import { useFieldConfig } from '@/stores/useFieldConfig'
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
    function $reset() {
      communityGroup.value = <CommunityGroup[]>[]
    }

    const communityGroupErrors = computed(() => {
      const communityGroupKeys =
        fieldConfigStore.performerTypeFields('CommunityGroup')
      let count = 0
      for (const group of communityGroup.value) {
        for (const key of communityGroupKeys) {
          if (
            !!group[key as keyof CommunityGroup] === false &&
            group[key as keyof CommunityGroup] !== 0
          ) {
            count++
          }
        }
      }
      return count
    })

    /**
     * Adds Community Group store array
     * @param communityGrp Community Group Object must have valid id property value
     */
    function addToStore(communityGrp: CommunityGroup): void {
      communityGroup.value.push({
        id: communityGrp.id,
        name: communityGrp.name || '',
        groupSize:
          communityGrp.groupSize !== null ? communityGrp.groupSize : null,
        chaperones:
          communityGrp.chaperones !== null ? communityGrp.chaperones : null,
        wheelchairs:
          communityGrp.wheelchairs !== null ? communityGrp.wheelchairs : null,
        earliestTime: communityGrp.earliestTime || '',
        latestTime: communityGrp.latestTime || '',
        unavailable: communityGrp.unavailable || '',
        conflictPerformers: communityGrp.conflictPerformers || '',
        photoPermission: communityGrp.photoPermission || false,
        __typename: communityGrp.__typename || 'CommunityGroup',
      })
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
        for (let i = 0; i < communityGroups.length; i++)
          addToStore(communityGroups[i])
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
      await communityGroupUpdate({
        communityGroupId,
        communityGroup: <CommunityGroupInput>(
          (communityGroupField || schlgrpProps)
        ),
      })
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
    }
  },
  {
    persist: true,
  }
)
