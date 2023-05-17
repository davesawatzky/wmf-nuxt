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
    const groupInfo = ref(<Group>{})

    function $reset() {
      groupInfo.value = <Group>{}
    }

    function addToStore(group: Group) {
      Object.assign(groupInfo.value, group)
    }

    async function createGroup(registrationId: number) {
      const {
        mutate: groupCreate,
        onDone: doneGroupCreate,
        onError,
      } = useMutation(GroupCreateDocument)
      const clone = Object.assign({}, groupInfo.value)
      delete clone.id
      await groupCreate({ registrationId, group: clone })
      doneGroupCreate((result) => {
        groupInfo.value.id = result.data.groupCreate.group.id
      })
      onError((error) => {
        console.log(error)
      })
    }

    function loadGroup(registrationId: number) {
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
        addToStore(<Group>result.data.registration.groups[0])
      })
      onError((error) => {
        console.log(error)
      })
      return {
        resultGroup,
        loadGroup,
      }
    }

    async function updateGroup() {
      const { mutate: groupUpdate, onError } = useMutation(GroupUpdateDocument)
      const clone = Object.assign({}, groupInfo.value)
      delete clone.id
      await groupUpdate({
        groupId: groupInfo.value.id,
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
      groupInfo,
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
