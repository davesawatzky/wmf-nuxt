// import { provideApolloClient } from '@vue/apollo-composable'
// import apolloClient from '@/utilities/apolloClient'
import { GroupCreateDocument, GroupDeleteDocument, GroupInfoDocument, GroupUpdateDocument } from '~/graphql/gql/graphql'

interface Group {
  id?: number
  name: string
  groupType: string
  numberOfPerformers: number
  age: number
  instruments: string
}

// provideApolloClient(apolloClient)

export const useGroup = defineStore(
  'group',
  () => {
    const groupInfo = ref({
      id: 0,
      name: '',
      groupType: '', // Vocal, Instrumental
      numberOfPerformers: 1,
      age: 10,
      instruments: '',
    } as Group)

    function $reset() {
      groupInfo.value = {
        id: 0,
        name: '',
        groupType: '',
        numberOfPerformers: 1,
        age: 10,
        instruments: '',
      }
    }

    function addToStore(group: Group) {
      Object.assign(groupInfo.value, group)
    }

    async function createGroup(registrationId: number) {
      const { mutate: groupCreate, onDone: doneGroupCreate, onError } = useMutation(GroupCreateDocument)
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
      } = useLazyQuery(GroupInfoDocument, { registrationId }, { fetchPolicy: 'no-cache' })
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
