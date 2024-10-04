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
    const fieldConfigStore = useFieldConfig()
    const communityErrors = ref(0)
    function $reset() {
      community.value = <Community>{}
    }

    /**
     * Adds Community Object to the store. Only one
     * @param comm Community object must have valid id property value
     */
    function addToStore(comm: Partial<Community>) {
      community.value.id = comm.id!
      community.value.name = comm.name || ''
      community.value.address = comm.address || ''
      community.value.city = comm.city || 'Winnipeg'
      community.value.province = comm.province || 'MB'
      community.value.postalCode = comm.postalCode || ''
      community.value.phone = comm.phone || ''
      community.value.email = comm.email || ''
      community.value.__typename = comm.__typename || 'Community'
    }

    function findInitialCommunityErrors() {
      const communityKeys = fieldConfigStore.performerTypeFields('Community')
      let count = 0
      for (const key of communityKeys) {
        if (!community.value[key as keyof Community]) {
          count++
        }
      }
      communityErrors.value = count
    }

    /**
     * Creates new Community in db and adds it to the store
     * @param registrationId ID of Registration Form
     * @returns Promise
     */
    const {
      mutate: communityCreate,
      loading: communityCreateLoading,
      onDone: onCommunityCreateDone,
      onError: onCommunityCreateError,
    } = useMutation(CommunityCreateDocument)
    async function createCommunity(registrationId: number) {
      await communityCreate({
        registrationId,
        community: <CommunityInput>{
          city: 'Winnipeg',
          province: 'MB',
        },
      })
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
     * Loads Community information from db and adds it to the store.
     * @param registrationId ID of Registration Form
     */
    const {
      result: resultCommunity,
      load: communityLoad,
      refetch: refetchCommunity,
      onResult: onLoadCommunityResult,
      onError: onLoadCommunityError,
    } = useLazyQuery(CommunityInfoDocument, undefined, {
      fetchPolicy: 'no-cache',
    })
    async function loadCommunity(registrationId: number) {
      ;(await communityLoad(null, { registrationId })) ||
        (await refetchCommunity())
    }
    watch(resultCommunity, (newResult) => {
      if (newResult?.registration.community) {
        addToStore(<Community>newResult.registration.community)
        findInitialCommunityErrors()
      }
    })
    onLoadCommunityError((error) => {
      console.log(error)
    })

    /**
     * Updates Community record in db from store.
     * @returns Promise
     */
    const {
      mutate: communityUpdate,
      loading: communityUpdateLoading,
      onDone: onCommunityUpdateDone,
      onError: onCommunityUpdateError,
    } = useMutation(CommunityUpdateDocument, {
      fetchPolicy: 'network-only',
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

    /**
     * Removes the Community record from the db.
     * @param communityId ID of the Community record
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
      deleteCommunity,
      $reset,
      communityErrors,
      updateCommunity,
      loadCommunity,
      createCommunity,
      community,
      addToStore,
    }
  },
  {
    persist: true,
  }
)
