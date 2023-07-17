import { defineStore } from 'pinia'
import {
  PerformerCreateDocument,
  PerformerDeleteDocument,
  PerformerInfoDocument,
  PerformerUpdateDocument,
} from '~/graphql/gql/graphql'
import type { Performer, PerformerInput } from '~/graphql/gql/graphql'

export const usePerformers = defineStore(
  'performers',
  () => {
    const performers = ref([] as Performer[])

    function $reset() {
      performers.value = <Performer[]>[]
    }

    const numberOfPerformers = computed(() => {
      return performers.value.length
    })

    /**
     * Returns first name plus last name
     */
    const fullName = computed(() => {
      const name = performers.value.map((item) => {
        return item.firstName && ' ' && item.lastName
      })
      return name
    })

    /**
     * Add one or more performer objects to the store as an array
     * Multiple performers may be included in group registrations
     * @param perform at minimum, must include valid id property value
     */
    function addToStore(performer: Performer): void {
      performers.value.push(<Performer>{
        id: performer.id,
        firstName: performer.firstName || '',
        lastName: performer.lastName || '',
        age: performer.age || 10,
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
     * @returns Promise
     */
    function createPerformer(registrationId: number): Promise<unknown> {
      return new Promise((resolve, reject) => {
        const { mutate, onDone, onError } = useMutation(PerformerCreateDocument)
        mutate({
          registrationId,
          performer: <PerformerInput>{
            city: 'Winnipeg',
            province: 'MB',
          },
        }).catch((error) => console.log(error))
        onDone((result) => {
          const performer: Performer = result.data.performerCreate.performer
          addToStore(performer)
          resolve('Success')
        })
        onError((error) => {
          reject(console.log(error))
        })
      })
    }

    /**
     * Loads all performers from a registration form into store in an array
     * @param registrationId ID of Registration form
     * @returns Promise
     */
    function loadPerformers(registrationId: number): Promise<unknown> {
      return new Promise((resolve, reject) => {
        const {
          result: resultPerformers,
          load,
          onResult,
          onError,
        } = useLazyQuery(
          PerformerInfoDocument,
          { registrationId },
          { fetchPolicy: 'no-cache' }
        )
        load()
        onResult((result) => {
          const performers: Performer[] = result.data.registration.performers
          for (let i = 0; i < performers.length; i++) {
            addToStore(performers[i])
          }
          resolve('Success')
        })
        onError((error) => {
          reject(console.log(error))
        })
      })
    }

    /**
     * Updates an individual performer from store to db
     * @param performerId ID of performer to update
     * @param field Optional single fieldname to update
     * @returns
     */
    function updatePerformer(
      performerId: number,
      field?: string
    ): Promise<unknown> {
      return new Promise((resolve, reject) => {
        const {
          mutate: performerUpdate,
          onDone,
          onError,
        } = useMutation(PerformerUpdateDocument, {
          fetchPolicy: 'no-cache',
        })
        const person = <Performer>performers.value.find((item) => {
          return item.id === performerId
        })
        const { id, __typename, ...personProps } = person
        let performerField = null
        if (field && Object.keys(personProps).includes(field)) {
          performerField = Object.fromEntries(
            Array(Object.entries(personProps).find((item) => item[0] === field))
          )
        }
        performerUpdate({
          performerId,
          performer: <PerformerInput>(performerField || personProps),
        }).catch((error) => console.log(error))
        onDone(() => {
          resolve('Success')
        })
        onError((error) => {
          reject(console.log(error))
        })
      })
    }

    /**
     * Runs the updatePerformer function for all performers
     */
    async function updateAllPerformers(): Promise<void> {
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
    function deletePerformer(performerId: number): Promise<unknown> {
      return new Promise((resolve, reject) => {
        const {
          mutate: performerDelete,
          onDone,
          onError,
        } = useMutation(PerformerDeleteDocument)
        performerDelete({ performerId }).catch((error) => console.log(error))
        onDone(() => {
          const performerIndex = performers.value.findIndex(
            (item) => item.id === performerId
          )
          performers.value.splice(performerIndex, 1)
          console.log(performers.value)

          resolve(performerIndex)
        })
        onError((error) => {
          reject(console.log(error))
        })
      })
    }

    return {
      performers,
      $reset,
      numberOfPerformers,
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
