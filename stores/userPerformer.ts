import { defineStore } from 'pinia'
import { useFieldConfig } from '@/stores/useFieldConfig'
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
    const performers = ref([] as Performer[])
    const fieldConfigStore = useFieldConfig()
    const registrationStore = useRegistration()
    function $reset() {
      performers.value.splice(0, performers.value.length)
    }

    const numberOfPerformers = computed(() => {
      return performers.value.length
    })

    const averageAge = computed(() => {
      let totalAge = 0
      for (let i = 0; i < performers.value.length; i++)
        totalAge += performers.value[i].age ?? 0

      return Math.round(totalAge / performers.value.length)
    })

    const performerErrors = computed(() => {
      const performerKeys = fieldConfigStore.performerTypeFields('Performer')
      let count = 0
      for (const performer of performers.value) {
        for (const key of performerKeys) {
          if (!!performer[key as keyof Performer] === false) {
            count++
          }
        }
      }
      return count
    })

    /**
     * Returns first name plus last name
     */
    const fullName = computed(() => {
      const name = []
      for (let i = 0; i < performers.value.length; i++) {
        name.push(
          `${performers.value[i].firstName} ${performers.value[i].lastName}`
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
      performers.value.push(<Performer>{
        id: performer.id,
        firstName: performer.firstName || '',
        lastName: performer.lastName || '',
        age: performer.age || undefined,
        level: performer.level || '',
        instrument: performer.instrument || '',
        otherClasses: performer.otherClasses || '',
        apartment: performer.apartment || '',
        streetNumber: performer.streetNumber || '',
        streetName: performer.streetName || '',
        city: performer.city || 'Winnipeg',
        province: performer.province || 'MB',
        postalCode: performer.postalCode || '',
        email: performer.email || '',
        phone: performer.phone || '',
        __typename: performer.__typename || 'Performer',
      })
    }

    /**
     * Adds new Performer to db and store
     * @param registrationId ID of Registration Form
     */
    const {
      mutate: performerCreate,
      loading: performerCreateLoading,
      onDone: onPerformerCreateDone,
      onError: onPerformerCreateError,
    } = useMutation(PerformerCreateDocument)
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
        console.log(result.data.performerCreate.userErrors)
      }
    })
    onPerformerCreateError((error) => {
      console.log(error)
    })

    /**
     * Loads all performers from a registration form into store in an array
     * @param registrationId ID of Registration form
     */
    const {
      result: resultPerformers,
      load: loadPerformers,
      onResult: onPerformersResult,
      onError: onPerformersLoadError,
    } = useLazyQuery(
      PerformersDocument,
      { registrationId: registrationStore.registrationId },
      { fetchPolicy: 'no-cache' }
    )
    onPerformersResult((result) => {
      try {
        if (result.data.performers) {
          const performers: Performer[] = result.data.performers
          for (let i = 0; i < performers.length; i++) addToStore(performers[i])
        }
      } catch (error) {
        console.log(error)
      }
    })
    onPerformersLoadError((error) => {
      console.log(error)
    })

    /**
     * Updates an individual performer from store to db
     * @param performerId ID of performer to update
     * @param field Optional single fieldname to update
     */
    const {
      mutate: performerUpdate,
      loading: performerUpdateLoading,
      onDone: onPerformerUpdateDone,
      onError: onPerformerUpdateError,
    } = useMutation(PerformerUpdateDocument, {
      fetchPolicy: 'no-cache',
    })
    async function updatePerformer(performerId: number, field?: string) {
      const person = <Performer>performers.value.find((item) => {
        return item.id === performerId
      })
      const { id, __typename, ...personProps } = person
      let performerField = null
      if (field && Object.keys(personProps).includes(field)) {
        performerField = Object.fromEntries(
          Array(Object.entries(personProps).find((item) => item[0] === field)!)
        )
      }
      await performerUpdate({
        performerId,
        performer: <PerformerInput>(performerField || personProps),
      })
    }
    onPerformerUpdateError((error) => {
      console.log(error)
    })

    /**
     * Runs the updatePerformer function for all performers
     */
    async function updateAllPerformers() {
      for (let i = 0; i < performers.value.length; i++) {
        await updatePerformer(performers.value[i].id)
      }
    }

    /**
     * Removes a performer from the store and the db
     *
     * @param performerId ID of the individual performer in the Array
     * @returns performer array index number
     */
    const {
      mutate: performerDelete,
      loading: performerDeleteLoading,
      onDone: onPerformerDeleteDone,
      onError: onPerformerDeleteError,
    } = useMutation(PerformerDeleteDocument)
    async function deletePerformer(performerId: number) {
      await performerDelete({ performerId })
      onPerformerDeleteDone(() => {
        const performerIndex = performers.value.findIndex(
          (item) => item.id === performerId
        )
        performers.value.splice(performerIndex, 1)
      })
    }
    onPerformerDeleteError((error) => {
      console.log(error)
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
    }
  },
  {
    persist: true,
  }
)
