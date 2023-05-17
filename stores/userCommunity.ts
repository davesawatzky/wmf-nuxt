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
    const communityInfo = ref([] as Community[])

    function $reset() {
      communityInfo.value = <Community[]>[]
    }

    function addToStore(communityData: Community | null) {
      communityInfo.value.push({
        id: 0,
        name: '',
        groupSize: 10,
        chaperones: 0,
        wheelchairs: 0,
        earliestTime: '',
        latestTime: '',
        unavailable: '',
        conflictPerformers: '',
        __typename: 'Community',
      })

      if (communityData) {
        Object.assign(
          communityInfo.value[communityInfo.value.length - 1],
          communityData
        )
      }
    }

    async function createCommunity(registrationId: number) {
      const {
        mutate: communityCreate,
        onDone: doneCommunityCreate,
        onError,
      } = useMutation(CommunityCreateDocument, { fetchPolicy: 'no-cache' })
      addToStore(null)
      const clone = Object.assign(
        {},
        communityInfo.value[communityInfo.value.length - 1]
      )
      delete clone.id
      await communityCreate({
        registrationId,
        community: clone,
      })
      doneCommunityCreate((result) => {
        communityInfo.value[communityInfo.value.length - 1].id =
          result.data.communityCreate.community.id
      })
      onError((error) => {
        console.log(error)
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
      const clone = Object.assign({}, communityInfo.value[communityIndex])
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
      for (const eachCommunity of communityInfo.value) {
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
        const index = communityInfo.value.map((e) => e.id).indexOf(communityId)
        communityInfo.value.splice(index, 1)
      })
      onError((error) => {
        console.log(error)
      })
    }
    return {
      $reset,
      deleteCommunity,
      updateCommunity,
      communityInfo,
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
