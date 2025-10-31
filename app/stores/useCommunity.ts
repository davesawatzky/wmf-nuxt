import { useFieldConfig } from '~/stores/useFieldConfig'
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
    const fieldConfigStore = useFieldConfig()
    const communityErrors = ref(0)
    const community = ref<Partial<Community>>(createEmptyCommunity())

    /**
     * Factory function to create an empty community object
     */
    function createEmptyCommunity(): Partial<Community> {
      return {
        id: 0,
        name: null,
        address: null,
        city: 'Winnipeg',
        province: 'MB',
        postalCode: null,
        phone: null,
        email: null,
        __typename: 'Community',
      }
    }

    /**
     * Resets the community store to initial state
     */
    function $reset() {
      community.value = createEmptyCommunity()
      communityErrors.value = 0
    }

    /**
     * Adds Community Object to the store. Only one
     * @param comm Community object must have valid id property value
     */
    function addToStore(comm: Partial<Community>) {
      community.value = {
        id: comm.id!,
        name: comm.name || null,
        address: comm.address || null,
        city: comm.city || 'Winnipeg',
        province: comm.province || 'MB',
        postalCode: comm.postalCode || null,
        phone: comm.phone || null,
        email: comm.email || null,
        __typename: comm.__typename || 'Community',
      }
    }

    function findInitialCommunityErrors() {
      const communityKeys = fieldConfigStore.performerTypeFields('Community')
      let count = 0
      for (const key of communityKeys) {
        if (community.value[key as keyof Community] === null) {
          count++
        }
      }
      communityErrors.value = count
    }

    /**
     * Creates new Community in db and adds it to the store
     * @param registrationId ID of Registration Form
     */
    const {
      mutate: communityCreate,
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
        console.error(
          'Failed to create community:',
          result.data.communityCreate.userErrors
        )
      }
    })
    onCommunityCreateError((error) => {
      console.error(error)
    })

    /**
     * Loads Community information from db and adds it to the store.
     * @param registrationId ID of Registration Form
     */
    const {
      result: resultCommunity,
      load: communityLoad,
      refetch: refetchCommunity,
      onError: onLoadCommunityError,
    } = useLazyQuery(CommunityInfoDocument, undefined, {
      fetchPolicy: 'no-cache',
    })
    async function loadCommunity(registrationId: number) {
      const loaded = await communityLoad(null, { registrationId })
      if (!loaded) {
        await refetchCommunity()
      }
    }
    watch(resultCommunity, (newResult) => {
      if (newResult?.registration.community) {
        addToStore(<Community>newResult.registration.community)
        findInitialCommunityErrors()
      }
    })
    onLoadCommunityError((error) => {
      console.error(error)
    })

    /**
     * Updates Community record in db from store.
     * @param field Optional specific field to update
     */
    const { mutate: communityUpdate, onError: onCommunityUpdateError } =
      useMutation(CommunityUpdateDocument, {
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
      try {
        await communityUpdate({
          communityId: community.value.id!,
          community: communityField || (communityProps as CommunityInput),
        })
        return 'complete'
      } catch (error) {
        console.error('Failed to update community:', error)
        return 'error'
      }
    }
    onCommunityUpdateError((error) => {
      console.error(error)
    })

    /**
     * Removes the Community record from the db.
     * @param communityId ID of the Community record
     */
    const {
      mutate: communityDelete,
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
      console.error(error)
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
      findInitialCommunityErrors,
    }
  },
  {
    persist: true,
  }
)
