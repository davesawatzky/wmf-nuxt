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
    const community = ref([] as Community[])

    function $reset() {
      community.value = <Community[]>[]
    }

    function addToStore(comm: Community) {
      community.value.push({
        id: comm.id,
        name: comm.name || '',
        groupSize: comm.groupSize || null,
        chaperones: comm.chaperones || null,
        wheelchairs: comm.wheelchairs || null,
        earliestTime: comm.earliestTime || '',
        latestTime: comm.latestTime || '',
        unavailable: comm.unavailable || '',
        conflictPerformers: comm.conflictPerformers || '',
        __typename: comm.__typename || 'Community',
      })
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
      const {
        result: resultCommunities,
        load: loadCommunities,
        onResult: resultLoadCommunity,
        onError,
      } = useLazyQuery(
        CommunityInfoDocument,
        { registrationId },
        { fetchPolicy: 'no-cache' }
      )
      resultLoadCommunity((result) => {
        for (let i = 0; i < result.data.registration.communities.length; i++) {
          addToStore(<Community>result.data.registration.communities[i])
        }
      })
      onError((error) => {
        console.log(error)
      })
      return {
        resultCommunities,
        loadCommunities,
      }
    }

    async function updateCommunity(
      communityIndex: number,
      communityId: number
    ) {
      const { mutate: communityUpdate, onError } = useMutation(
        CommunityUpdateDocument,
        {
          fetchPolicy: 'no-cache',
        }
      )
      const clone = Object.assign({}, community.value[communityIndex])
      delete clone.id
      await communityUpdate({
        communityId,
        community: clone,
      })
      onError((error) => {
        console.log(error)
      })
    }

    async function updateAllCommunities() {
      let communityIndex = 0
      for (const eachCommunity of community.value) {
        await updateCommunity(communityIndex, eachCommunity.id)
        communityIndex++
      }
    }

    async function deleteCommunity(communityId: number) {
      const {
        mutate: communityDelete,
        onDone: doneCommunityDelete,
        onError,
      } = useMutation(CommunityDeleteDocument)
      await communityDelete({ communityId })
      doneCommunityDelete(() => {
        const index = community.value.map((e) => e.id).indexOf(communityId)
        community.value.splice(index, 1)
      })
      onError((error) => {
        console.log(error)
      })
    }
    return {
      $reset,
      deleteCommunity,
      updateCommunity,
      community,
      updateAllCommunities,
      addToStore,
      createCommunity,
      loadCommunities,
    }
  },
  {
    persist: true,
  }
)
