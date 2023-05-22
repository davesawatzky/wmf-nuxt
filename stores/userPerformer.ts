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
    const performer = ref([] as Performer[])

    function $reset() {
      performer.value = <Performer[]>[]
    }

    const numberOfPerformers = computed(() => {
      return performer.value.length
    })

    const fullName = computed(() => {
      const name = performer.value.map((item) => {
        return item.firstName && ' ' && item.lastName
      })
      return name
    })

    function addToStore(perform: Performer) {
      performer.value.push(<Performer>{
        id: perform.id,
        firstName: perform.firstName || '',
        lastName: perform.lastName || '',
        age: perform.age || null,
        level: perform.level || '',
        instrument: perform.instrument || '',
        otherClasses: perform.otherClasses || '',
        apartment: perform.apartment || '',
        streetNumber: perform.streetNumber || '',
        streetName: perform.streetName || '',
        city: perform.city || 'Winnipeg',
        province: perform.province || 'MB',
        postalCode: perform.postalCode || '',
        email: perform.email || '',
        phone: perform.phone || '',
        __typename: perform.__typename || 'Performer',
      })
    }

    function createPerformer(registrationId: number) {
      return new Promise((resolve, reject) => {
        console.log('RegID-----: ', registrationId)
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

    function loadPerformers(registrationId: number) {
      return new Promise((resolve, reject) => {
        const {
          result: resultPerformers,
          load: loadPerformer,
          onResult,
          onError,
        } = useLazyQuery(
          PerformerInfoDocument,
          { registrationId },
          { fetchPolicy: 'no-cache' }
        )
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
        return {
          resultPerformers,
          loadPerformer,
        }
      })
    }

    async function updatePerformer(
      performerIndex: number,
      performerId: number
    ) {
      const { mutate: performerUpdate, onError } = useMutation(
        PerformerUpdateDocument,
        {
          fetchPolicy: 'no-cache',
        }
      )
      const clone = Object.assign({}, performer.value[performerIndex])
      delete clone.id
      await performerUpdate({ performerId, performer: clone })
      onError((error) => {
        console.log(error)
      })
    }

    async function updateAllPerformers() {
      let performerIndex = 0
      for (const eachPerformer of performer.value) {
        await updatePerformer(performerIndex, eachPerformer.id)
        performerIndex++
      }
    }

    async function deletePerformer(performerId: number) {
      const {
        mutate: performerDelete,
        onDone: donePerformerDelete,
        onError,
      } = useMutation(PerformerDeleteDocument)
      await performerDelete({ performerId })
      donePerformerDelete(() => {
        const index = performer.value.map((e) => e.id).indexOf(performerId)
        performer.value.splice(index, 1)
      })
      onError((error) => {
        console.log(error)
      })
    }

    return {
      performer,
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
