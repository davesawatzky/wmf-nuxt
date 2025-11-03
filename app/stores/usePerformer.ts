import { defineStore } from 'pinia'
import { useFieldConfig } from '~/stores/useFieldConfig'
import {
  PerformerCreateDocument,
  PerformerDeleteDocument,
  PerformerUpdateDocument,
  PerformersDocument,
} from '~/graphql/gql/graphql'
import type {
  Performer,
  PerformerCreateMutation,
  PerformerInput,
} from '~/graphql/gql/graphql'

export const usePerformers = defineStore(
  'performers',
  () => {
    const fieldConfigStore = useFieldConfig()
    const performers = ref<Performer[]>([])
    const performerErrors = ref<{ id: number; count: number }[]>([])

    /**
     * Resets the performers store to initial state
     */
    function $reset() {
      performers.value = []
      performerErrors.value = []
    }

    const numberOfPerformers = computed(() => {
      return performers.value.length
    })

    const averageAge = computed(() => {
      let totalAge = 0
      for (let i = 0; i < performers.value.length; i++) {
        totalAge += performers.value[i]?.age ?? 0
      }
      return Math.round(totalAge / performers.value.length)
    })

    /**
     * Returns first name plus last name
     */
    const fullName = computed(() => {
      const name = []
      for (let i = 0; i < performers.value.length; i++) {
        name.push(
          `${performers.value[i]?.firstName} ${performers.value[i]?.lastName}`
        )
      }
      return name
    })

    /**
     * Add one or more performer objects to the store as an array
     * Multiple performers may be included in group registrations
     * @param performer At minimum, must include valid id property value
     */
    function addToStore(performer: Partial<Performer>): void {
      performers.value.push({
        id: performer.id!,
        pronouns: performer.pronouns || null,
        firstName: performer.firstName || null,
        lastName: performer.lastName || null,
        age: performer.age || null,
        level: performer.level || null,
        instrument: performer.instrument || null,
        otherClasses: performer.otherClasses || null,
        unavailable: performer.unavailable || null,
        address: performer.address || null,
        city: performer.city || 'Winnipeg',
        province: performer.province || 'MB',
        postalCode: performer.postalCode || null,
        email: performer.email || null,
        phone: performer.phone || null,
        photoPermission: performer.photoPermission || null,
        __typename: performer.__typename || 'Performer',
      })
      performerErrors.value.push({ id: performer.id!, count: 0 })
    }

    function findInitialPerformerErrors() {
      const performerKeys = fieldConfigStore.performerTypeFields('Performer')
      for (const performer of performers.value) {
        let count = 0
        for (const key of performerKeys) {
          if (performer[key as keyof Performer] === null) {
            count++
          }
        }
        const index = performerErrors.value.findIndex(
          (item) => item.id === performer.id
        )
        performerErrors.value[index]!.count = count
      }
    }

    const totalPerformerErrors = computed(() => {
      return performerErrors.value.reduce(
        (total, item) => total + item.count,
        0
      )
    })

    /**
     * Adds new Performer to db and store
     * @param registrationId ID of Registration Form
     */
    const {
      mutate: performerCreate,
      onDone: onPerformerCreateDone,
      onError: onPerformerCreateError,
    } = useMutation(PerformerCreateDocument, {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    })
    async function createPerformer(registrationId: number) {
      await performerCreate({
        registrationId,
        performer: <PerformerInput>{
          city: 'Winnipeg',
          province: 'MB',
        },
      })
    }
    onPerformerCreateDone((result) => {
      if (result.data?.performerCreate.performer) {
        const performer: PerformerCreateMutation['performerCreate']['performer'] =
          result.data.performerCreate.performer
        addToStore(performer)
      } else if (result.data?.performerCreate.userErrors) {
        console.error(
          'Failed to create performer:',
          result.data.performerCreate.userErrors
        )
      }
    })
    onPerformerCreateError((error) => {
      console.error(error)
    })

    /**
     * Loads all performers from a registration form into store in an array
     * @param registrationId ID of Registration form
     */
    const {
      result: resultPerformers,
      load: performersLoad,
      refetch: performersRefetch,
      onError: onPerformersError,
    } = useLazyQuery(PerformersDocument, undefined, {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    })
    async function loadPerformers(registrationId: number) {
      const loaded = await performersLoad(null, { registrationId })
      if (!loaded) {
        await performersRefetch()
      }
    }
    watch(resultPerformers, (newResult) => {
      if (newResult?.performers) {
        const performers: Omit<Performer, 'selections'>[] = newResult.performers
        for (let i = 0; i < performers.length; i++) {
          addToStore(performers[i]!)
        }
        findInitialPerformerErrors()
      }
    })
    onPerformersError((error) => {
      console.error('Performer load error:', error)
    })

    /**
     * Updates an individual performer from store to db
     * @param performerId ID of performer to update
     * @param field Optional single fieldname to update
     */
    const { mutate: performerUpdate, onError: onPerformerUpdateError } =
      useMutation(PerformerUpdateDocument, {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
      })
    async function updatePerformer(performerId: number, field?: string) {
      const person = performers.value.find((item) => item.id === performerId)
      if (!person) {
        console.error('Performer not found:', {
          operation: 'updatePerformer',
          performerId,
        })
        return 'error'
      }

      const { id, __typename, ...personProps } = person
      let performerField = null
      if (field && Object.keys(personProps).includes(field)) {
        performerField = Object.fromEntries(
          Array(Object.entries(personProps).find((item) => item[0] === field)!)
        )
      }
      try {
        await performerUpdate({
          performerId,
          performer: performerField || (personProps as PerformerInput),
        })
        return 'complete'
      } catch (error) {
        console.error('Failed to update performer:', error)
        return 'error'
      }
    }
    onPerformerUpdateError((error) => {
      console.error(error)
    })

    /**
     * Runs the updatePerformer function for all performers
     */
    async function updateAllPerformers() {
      for (let i = 0; i < performers.value.length; i++) {
        await updatePerformer(performers.value[i]!.id)
      }
    }

    /**
     * Removes a performer from the store and the db
     * @param performerId ID of the individual performer in the Array
     */
    const { mutate: performerDelete, onError: onPerformerDeleteError } =
      useMutation(PerformerDeleteDocument)
    async function deletePerformer(performerId: number) {
      await performerDelete({ performerId })
      const performerIndex = performers.value.findIndex(
        (item) => item.id === performerId
      )
      if (performerIndex !== -1) {
        performers.value.splice(performerIndex, 1)
        performerErrors.value.splice(performerIndex, 1)
      } else {
        console.error('Performer not found for deletion:', {
          operation: 'deletePerformer',
          performerId,
        })
      }
    }
    onPerformerDeleteError((error) => {
      console.error(error)
    })

    return {
      performers,
      $reset,
      numberOfPerformers,
      averageAge,
      performerErrors,
      fullName,
      addToStore,
      createPerformer,
      updatePerformer,
      loadPerformers,
      updateAllPerformers,
      deletePerformer,
      findInitialPerformerErrors,
      totalPerformerErrors,
    }
  },
  {
    persist: true,
  }
)
