import { useFieldConfig } from '@/stores/useFieldConfig'
import {
  CommunityCreateDocument,
  CommunityDeleteDocument,
  CommunityInfoDocument,
  CommunityUpdateDocument,
} from '~/graphql/gql/graphql'
import type {
  Community,
  CommunityCreateMutation,
  CommunityInput,
} from '~/graphql/gql/graphql'

export const useCommunity = defineStore(
  'community',
  () => {
    const community = ref(<Community>{})
    const registrationStore = useRegistration()
    const fieldConfigStore = useFieldConfig()
    function $reset() {
      community.value = <Community>{}
    }

    const communityErrors = computed(() => {
      const communityKeys = fieldConfigStore.performerTypeFields('Community')
      let count = 0
      for (const key of communityKeys) {
        if (
          !!community.value[key as keyof Community] === false &&
          community.value[key as keyof Community] !== 0
        ) {
          count++
        }
      }
      return count
    })

    /**
     * Adds empty Community properties or a Community object into the store
     * @param comm Community object must include an id property value
     */
    function addToStore(comm: Community) {
      community.value.id = comm.id
      community.value.name = comm.name || ''
      community.value.groupSize =
        comm.groupSize !== null ? comm.groupSize : null
      community.value.chaperones =
        comm.chaperones !== null ? comm.chaperones : null
      community.value.wheelchairs =
        comm.wheelchairs !== null ? comm.wheelchairs : null
      community.value.earliestTime = comm.earliestTime || ''
      community.value.latestTime = comm.latestTime || ''
      community.value.unavailable = comm.unavailable || ''
      community.value.conflictPerformers = comm.conflictPerformers || ''
      community.value.__typename = comm.__typename || 'Community'
    }

    /**
     * Creates a new community object in the store and db.
     * @param registrationId ID of the Registration form
     * @returns Promise and saves the new id number
     */
    const {
      mutate: communityCreate,
      loading: communityCreateLoading,
      onDone: onCommunityCreateDone,
      onError: onCommunityCreateError,
    } = useMutation(CommunityCreateDocument, { fetchPolicy: 'no-cache' })
    async function createCommunity(registrationId: number) {
      await communityCreate({ registrationId })
    }
    onCommunityCreateDone((result) => {
      if (result.data?.communityCreate.community) {
        const community: CommunityCreateMutation['communityCreate']['community'] =
          result.data.communityCreate.community
        addToStore(community)
      } else if (result.data?.communityCreate.userErrors) {
        console.log(result.data.communityCreate.userErrors)
      }
    })
    onCommunityCreateError((error) => {
      console.log(error)
    })

    /**
     * Loads the Community information from the db and saves it in the store
     * @param registrationId ID of the Registration form

     */
    const {
      result: resultCommunity,
      load: communityLoad,
      refetch: refetchCommunity,
      onResult: onCommunityResult,
      onError: onCommunityError,
    } = useLazyQuery(CommunityInfoDocument, undefined, {
      fetchPolicy: 'no-cache',
    })
    async function loadCommunity(registrationId: number) {
      ;(await communityLoad(null, { registrationId })) ||
        (await refetchCommunity({ registrationId }))
    }
    onCommunityResult((result) => {
      addToStore(<Community>result.data.registration.community)
    })
    onCommunityError((error) => {
      console.log(error)
    })

    /**
     * Updates Community information from store to the db
     */
    const {
      mutate: communityUpdate,
      loading: communityUpdateLoading,
      onDone: onCommunityUpdateDone,
      onError: onCommunityUpdateError,
    } = useMutation(CommunityUpdateDocument, {
      fetchPolicy: 'no-cache',
    })
    async function updateCommunity(field?: string) {
      const { id, __typename, ...communityProps } = community.value
      let communityField = null
      if (field && Object.keys(communityProps).includes(field)) {
        communityField = Object.fromEntries(
          Array(
            Object.entries(communityProps).find((item) => item[0] === field)!
          )
        )
      }
      await communityUpdate({
        communityId: community.value.id,
        community: <CommunityInput>(communityField || communityProps),
      })
    }
    onCommunityUpdateError((error) => {
      console.log(error)
    })

    // async function updateAllCommunities() {
    //   let communityIndex = 0
    //   for (const eachCommunity of community.value) {
    //     await updateCommunity(communityIndex, eachCommunity.id)
    //     communityIndex++
    //   }
    // }

    /**
     * Removes the Community from the store and the db
     * @param communityId ID of the Community Record
     * @returns Promise
     */
    const {
      mutate: communityDelete,
      loading: communityDeleteLoading,
      onDone: onCommunityDeleteDone,
      onError: onCommunityDeleteError,
    } = useMutation(CommunityDeleteDocument)
    async function deleteCommunity(communityId: number) {
      await communityDelete({ communityId })
    }
    onCommunityDeleteDone(() => {
      $reset()
    })
    onCommunityDeleteError((error) => {
      console.log(error)
    })

    return {
      $reset,
      communityErrors,
      deleteCommunity,
      updateCommunity,
      community,
      // updateAllCommunities,
      addToStore,
      createCommunity,
      loadCommunity,
    }
  },
  {
    persist: true,
  }
)
