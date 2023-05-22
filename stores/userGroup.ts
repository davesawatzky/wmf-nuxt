import {
  GroupCreateDocument,
  GroupDeleteDocument,
  GroupInfoDocument,
  GroupUpdateDocument,
} from '~/graphql/gql/graphql'
import type { Group } from '~/graphql/gql/graphql'

export const useGroup = defineStore(
  'group',
  () => {
    const group = ref(<Group>{})

    function $reset() {
      group.value = <Group>{}
    }

    function addToStore(grp: Group) {
      group.value.id = grp.id
      group.value.groupType = grp.groupType || ''
      group.value.name = grp.name || ''
      group.value.numberOfPerformers = grp.numberOfPerformers || null
      group.value.instruments = grp.instruments || ''
      group.value.age = grp.age || null
      group.value.__typename = grp.__typename || 'Group'
    }

    function createGroup(registrationId: number) {
      return new Promise((resolve, reject) => {
        const {
          mutate: groupCreate,
          onDone,
          onError,
        } = useMutation(GroupCreateDocument)
        groupCreate({ registrationId }).catch((error) => console.log(error))
        onDone((result) => {
          const group: Group = result.data.groupCreate.group
          addToStore(group)
          resolve('Success')
        })
        onError((error) => {
          reject(console.log(error))
        })
      })
    }

    function loadGroup(registrationId: number) {
      return new Promise((resolve, reject) => {
        const {
          result: resultGroup,
          load: loadGroup,
          onResult: resultLoadGroup,
          onError,
        } = useLazyQuery(
          GroupInfoDocument,
          { registrationId },
          { fetchPolicy: 'no-cache' }
        )
        resultLoadGroup((result) => {
          addToStore(<Group>result.data.registration.groups)
        })
        onError((error) => {
          reject(console.log(error))
        })
        return {
          resultGroup,
          loadGroup,
        }
      })
    }

    async function updateGroup() {
      const { mutate: groupUpdate, onError } = useMutation(GroupUpdateDocument)
      const clone = Object.assign({}, group.value)
      delete clone.id
      await groupUpdate({
        groupId: group.value.id,
        group: clone,
      })
      onError((error) => {
        console.log(error)
      })
    }

    async function deleteGroup(groupId: number) {
      const { mutate: groupDelete, onError } = useMutation(GroupDeleteDocument)
      await groupDelete({ groupId })
      onError((error) => {
        console.log(error)
      })
    }
    return {
      group,
      $reset,
      addToStore,
      createGroup,
      loadGroup,
      updateGroup,
      deleteGroup,
    }
  },
  {
    persist: true,
  }
)
