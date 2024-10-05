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
import { number } from 'yup'
import type { count } from 'console'

export const usePerformers = defineStore(
  'performers',
  () => {
    const performers = ref([] as Performer[])
    const fieldConfigStore = useFieldConfig()
    const registrationStore = useRegistration()
    const performerErrors = ref<{ id: number; count: number }[]>([])
    function $reset() {
      performers.value.splice(0, performers.value.length)
      performerErrors.value.splice(0, performerErrors.value.length)
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
        let index = performerErrors.value.findIndex(
          (item) => item.id === performer.id
        )
        performerErrors.value[index].count = count
      }
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
      load: performersLoad,
      refetch: performersRefetch,
      onResult: onPerformersResult,
      onError: onPerformersError,
    } = useLazyQuery(PerformersDocument, undefined, { fetchPolicy: 'no-cache' })
    async function loadPerformers(registrationId: number) {
      ;(await performersLoad(null, { registrationId })) ||
        (await performersRefetch())
    }
    watch(resultPerformers, (newResult) => {
      if (newResult?.performers) {
        const performers: Performer[] = newResult.performers
        for (let i = 0; i < performers.length; i++) {
          addToStore(performers[i])
          findInitialPerformerErrors()
        }
      }
    })
    onPerformersError((error) => {
      console.log('Performer Load Error. ', error)
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
      const performerIndex = performers.value.findIndex(
        (item) => item.id === performerId
      )
      performers.value.splice(performerIndex, 1)
      performerErrors.value.splice(performerIndex, 1)
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
      findInitialPerformerErrors,
    }
  },
  {
    persist: true,
  }
)
