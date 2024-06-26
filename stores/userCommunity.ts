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
    function createCommunity(registrationId: number) {
      return new Promise((resolve, reject) => {
        const {
          mutate: communityCreate,
          onDone,
          onError,
        } = useMutation(CommunityCreateDocument, { fetchPolicy: 'no-cache' })
        communityCreate({ registrationId }).catch((error) => console.log(error))
        onDone((result) => {
          if (result.data?.communityCreate.community) {
            const community: CommunityCreateMutation['communityCreate']['community'] =
              result.data.communityCreate.community
            addToStore(community)
            resolve('Success')
          } else if (result.data?.communityCreate.userErrors) {
            console.log(result.data.communityCreate.userErrors)
          }
        })
        onError((error) => {
          reject(console.log(error))
        })
      })
    }

    /**
     * Loads the Community information from the db and saves it in the store
     * @param registrationId ID of the Registration form
     * @returns Promise and loads community ensemble data
     */
    function loadCommunity(registrationId: number) {
      return new Promise((resolve, reject) => {
        const {
          result: resultCommunity,
          load,
          onResult,
          onError,
        } = useLazyQuery(
          CommunityInfoDocument,
          { registrationId },
          { fetchPolicy: 'no-cache' }
        )
        load()
        onResult((result) => {
          addToStore(<Community>result.data.registration.community)
          resolve('Success')
        })
        onError((error) => {
          reject(console.log(error))
        })
      })
    }

    /**
     * Updates Community information from store to the db
     * @returns Promise
     */
    function updateCommunity(field?: string): Promise<unknown> {
      return new Promise((resolve, reject) => {
        const {
          mutate: communityUpdate,
          onDone,
          onError,
        } = useMutation(CommunityUpdateDocument, {
          fetchPolicy: 'no-cache',
        })
        const { id, __typename, ...communityProps } = community.value
        let communityField = null
        if (field && Object.keys(communityProps).includes(field)) {
          communityField = Object.fromEntries(
            Array(
              Object.entries(communityProps).find((item) => item[0] === field)!
            )
          )
        }
        communityUpdate({
          communityId: community.value.id,
          community: <CommunityInput>(communityField || communityProps),
        }).catch((error) => console.log(error))
        onDone(() => {
          resolve('Success')
        })
        onError((error) => {
          reject(console.log(error))
        })
      })
    }

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
    function deleteCommunity(communityId: number) {
      return new Promise((resolve, reject) => {
        const {
          mutate: communityDelete,
          onDone,
          onError,
        } = useMutation(CommunityDeleteDocument)
        communityDelete({ communityId }).catch((error) => console.log(error))
        onDone(() => {
          $reset()
          resolve('Success')
        })
        onError((error) => {
          reject(console.log(error))
        })
      })
    }

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
