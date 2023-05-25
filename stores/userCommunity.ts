import {
  CommunityCreateDocument,
  CommunityDeleteDocument,
  CommunityInfoDocument,
  CommunityUpdateDocument,
} from '~/graphql/gql/graphql'
import type { Community } from '~/graphql/gql/graphql'

export const useCommunity = defineStore(
  'community',
  () => {
    const community = ref(<Community>{})

    function $reset() {
      community.value = <Community>{}
    }

    function addToStore(comm: Community) {
      community.value.id = comm.id
      community.value.name = comm.name || ''
      community.value.groupSize = comm.groupSize || null
      community.value.chaperones = comm.chaperones || null
      community.value.wheelchairs = comm.wheelchairs || null
      community.value.earliestTime = comm.earliestTime || ''
      community.value.latestTime = comm.latestTime || ''
      community.value.unavailable = comm.unavailable || ''
      community.value.conflictPerformers = comm.conflictPerformers || ''
      community.value.__typename = comm.__typename || 'Community'
    }

    function createCommunity(registrationId: number) {
      return new Promise((resolve, reject) => {
        const {
          mutate: communityCreate,
          onDone,
          onError,
        } = useMutation(CommunityCreateDocument, { fetchPolicy: 'no-cache' })
        communityCreate({ registrationId }).catch((error) => console.log(error))
        onDone((result) => {
          const community: Community = result.data.communityCreate.community
          addToStore(community)
          resolve('Success')
        })
        onError((error) => {
          reject(console.log(error))
        })
      })
    }

    function loadCommunities(registrationId: number) {
      return new Promise((resolve, reject) => {
        const {
          result: resultCommunities,
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
          addToStore(<Community>result.data.registration.communities)
          resolve('Success')
        })
        onError((error) => {
          reject(console.log(error))
        })
        return {
          resultCommunities,
          loadCommunities,
        }
      })
    }

    function updateCommunity() {
      return new Promise((resolve, reject) => {
        const {
          mutate: communityUpdate,
          onDone,
          onError,
        } = useMutation(CommunityUpdateDocument, {
          fetchPolicy: 'no-cache',
        })
        communityUpdate({
          communityId: community.value.id,
          community: community.value,
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
      deleteCommunity,
      updateCommunity,
      community,
      // updateAllCommunities,
      addToStore,
      createCommunity,
      loadCommunities,
    }
  },
  {
    persist: true,
  }
)
