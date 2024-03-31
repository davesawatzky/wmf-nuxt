import { useFieldConfig } from '@/stores/useFieldConfig'
import { usePerformers } from '@/stores/userPerformer'
import {
  GroupCreateDocument,
  GroupDeleteDocument,
  GroupInfoDocument,
  GroupUpdateDocument,
} from '~/graphql/gql/graphql'
import type {
  Group,
  GroupCreateMutation,
  GroupInput,
} from '~/graphql/gql/graphql'

export const useGroup = defineStore(
  'group',
  () => {
    const group = ref(<Group>{})
    const performerStore = usePerformers()
    const fieldConfigStore = useFieldConfig()
    function $reset() {
      group.value = <Group>{}
    }

    const groupErrors = computed(() => {
      const groupKeys = fieldConfigStore.performerTypeFields('Group')
      let count = 0
      for (const key of groupKeys) {
        if (!!group.value[key as keyof Group] === false) {
          count++
        }
      }
      return count
    })

    watch(
      () => performerStore.numberOfPerformers,
      (newValue, oldValue) => {
        group.value.numberOfPerformers = newValue
      },
      { immediate: true },
    )

    watch(
      () => performerStore.averageAge,
      (newValue, oldValue) => {
        group.value.age = newValue
      },
      { immediate: true },
    )

    /**
     * Adds empty Group properties or Group object to the store
     * @param grp Group object, must include id property value
     */
    function addToStore(grp: Partial<Group>): void {
      group.value.id = grp.id!
      group.value.groupType = grp.groupType || ''
      group.value.name = grp.name || ''
      group.value.numberOfPerformers = grp.numberOfPerformers || undefined
      group.value.instruments = grp.instruments || ''
      group.value.age = grp.age || undefined
      group.value.__typename = grp.__typename || 'Group'
    }

    /**
     * Creates a new Group object on the db and adds it to the store
     * @param registrationId ID of the Registration Form
     * @returns Promise
     */
    function createGroup(registrationId: number): Promise<unknown> {
      return new Promise((resolve, reject) => {
        const {
          mutate: groupCreate,
          onDone,
          onError,
        } = useMutation(GroupCreateDocument)
        groupCreate({ registrationId }).catch(error => console.log(error))
        onDone((result) => {
          if (result.data?.groupCreate.group) {
            const group: GroupCreateMutation['groupCreate']['group']
              = result.data.groupCreate.group
            addToStore(group)
            resolve('Success')
          }
          else if (result.data?.groupCreate.userErrors) {
            console.log(result.data.groupCreate.userErrors)
          }
        })
        onError((error) => {
          reject(console.log(error))
        })
      })
    }

    /**
     * Loads Group record from db into store
     * @param registrationId ID of the Registration Form
     * @returns Promise
     */
    function loadGroup(registrationId: number): Promise<unknown> {
      return new Promise((resolve, reject) => {
        const {
          result: resultGroup,
          load,
          onResult,
          onError,
        } = useLazyQuery(
          GroupInfoDocument,
          { registrationId },
          { fetchPolicy: 'no-cache' },
        )
        load()
        onResult((result) => {
          addToStore(<Group>result.data.registration.group)
          resolve('Success')
        })
        onError((error) => {
          reject(console.log(error))
        })
      })
    }

    /**
     * Updates the Group object from the store to the db
     * @returns Promise
     */
    function updateGroup(field?: string): Promise<unknown> {
      return new Promise((resolve, reject) => {
        const {
          mutate: groupUpdate,
          onDone,
          onError,
        } = useMutation(GroupUpdateDocument, { fetchPolicy: 'network-only' })
        const { id, __typename, ...groupProps } = group.value
        let groupField = null
        if (field && Object.keys(groupProps).includes(field)) {
          groupField = Object.fromEntries(
            Array(Object.entries(groupProps).find(item => item[0] === field)!),
          )
        }
        groupUpdate({
          groupId: group.value.id,
          group: <GroupInput>(groupField || groupProps),
        }).catch(error => console.log(error))
        onDone(() => {
          resolve('Success')
        })
        onError((error) => {
          reject(console.log(error))
        })
      })
    }

    /**
     * Delete Group record form the store and db
     * @param groupId ID of the Group record
     * @returns Promise
     */
    function deleteGroup(groupId: number): Promise<unknown> {
      return new Promise((resolve, reject) => {
        const {
          mutate: groupDelete,
          onDone,
          onError,
        } = useMutation(GroupDeleteDocument)
        groupDelete({ groupId }).catch(error => console.log(error))
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
      group,
      $reset,
      groupErrors,
      addToStore,
      createGroup,
      loadGroup,
      updateGroup,
      deleteGroup,
    }
  },
  {
    persist: true,
  },
)
