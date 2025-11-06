import { useFieldConfig } from '~/stores/useFieldConfig'
import { usePerformers } from '~/stores/usePerformer'
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
    const appStore = useAppStore()
    const groupErrors = ref(0)
    function $reset() {
      group.value = <Group>{}
      groupErrors.value = 0
    }

    watch(
      () => performerStore.numberOfPerformers,
      async (newValue) => {
        if (
          group.value.numberOfPerformers !== newValue &&
          appStore.performerType === 'GROUP'
        ) {
          group.value.numberOfPerformers = newValue
          await updateGroup('numberOfPerformers')
        }
      },
      { flush: 'post' }
    )

    watch(
      () => performerStore.averageAge,
      async (newValue) => {
        if (
          group.value.age !== newValue &&
          appStore.performerType === 'GROUP'
        ) {
          group.value.age = newValue
          await updateGroup('age')
        }
      },
      { flush: 'post' }
    )

    /**
     * Adds empty Group properties or Group object to the store
     * @param grp Group object, must include id property value
     */
    function addToStore(grp: Partial<Group>): void {
      group.value.id = grp.id!
      group.value.groupType = grp.groupType || null
      group.value.name = grp.name || null
      group.value.numberOfPerformers = grp.numberOfPerformers || null
      group.value.instruments = grp.instruments || null
      group.value.age = grp.age || null
      group.value.__typename = grp.__typename || 'Group'
    }

    function findInitialGroupErrors() {
      const groupKeys = fieldConfigStore.performerTypeFields('Group')
      let count = 0
      for (const key of groupKeys) {
        if (group.value[key as keyof Group] === null) {
          count++
        }
      }
      groupErrors.value = count
    }

    /**
     * Creates a new Group object on the db and adds it to the store
     * @param registrationId ID of the Registration Form
     */

    const {
      mutate: groupCreate,
      onDone: onCreateGroupDone,
      onError: onCreateGroupError,
    } = useMutation(GroupCreateDocument, {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    })
    async function createGroup(registrationId: number) {
      await groupCreate({ registrationId })
    }
    onCreateGroupDone((result) => {
      if (result.data?.groupCreate.group) {
        const group: GroupCreateMutation['groupCreate']['group'] =
          result.data.groupCreate.group
        addToStore(group)
      } else if (result.data?.groupCreate.userErrors) {
        console.log(result.data.groupCreate.userErrors)
      }
    })
    onCreateGroupError((error) => {
      console.error(error)
    })

    /**
     * Loads Group record from db into store
     * @param registrationId ID of the Registration Form
     */

    const {
      result: resultGroup,
      load: groupLoad,
      refetch: refetchGroup,
      onError: onGroupLoadError,
    } = useLazyQuery(GroupInfoDocument, undefined, {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    })
    async function loadGroup(registrationId: number) {
      const loadResult = await groupLoad(null, { registrationId })
      if (!loadResult) {
        await refetchGroup()
      }
    }
    watch(resultGroup, (newResult) => {
      if (newResult?.registration.group) {
        addToStore(<Group>newResult.registration.group)
        findInitialGroupErrors()
      }
    })
    onGroupLoadError((error) => {
      console.error(error)
    })

    /**
     * Updates the Group object from the store to the db
     * @returns Promise
     */

    const { mutate: groupUpdate, onError: onGroupUpdateError } = useMutation(
      GroupUpdateDocument,
      {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      }
    )
    async function updateGroup(field?: string) {
      const { id, __typename, ...groupProps } = group.value
      let groupField = null
      if (field && Object.keys(groupProps).includes(field)) {
        groupField = Object.fromEntries(
          Array(Object.entries(groupProps).find((item) => item[0] === field)!)
        )
      }
      try {
        await groupUpdate({
          groupId: group.value.id,
          group: <GroupInput>(groupField || groupProps),
        })
        return 'complete'
      } catch (error) {
        console.error(error)
        return 'error'
      }
    }
    onGroupUpdateError((error) => {
      console.error(error)
    })

    /**
     * Delete Group record form the store and db
     * @param groupId ID of the Group record
     * @returns Promise
     */
    const {
      mutate: groupDelete,
      onDone: onGroupDeleteDone,
      onError: onGroupDeleteError,
    } = useMutation(GroupDeleteDocument)
    async function deleteGroup(groupId: number) {
      await groupDelete({ groupId })
    }
    onGroupDeleteDone(() => {
      $reset()
    })
    onGroupDeleteError((error) => {
      console.error(error)
    })

    return {
      group,
      $reset,
      groupErrors,
      addToStore,
      createGroup,
      loadGroup,
      updateGroup,
      deleteGroup,
      findInitialGroupErrors,
    }
  },
  {
    persist: true,
  }
)
