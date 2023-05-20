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

    function addToStore(data: Performer) {
      performer.value.push(data)
    }

    async function createPerformer(registrationId: number) {
      console.log('RegID-----: ', registrationId)

      const { mutate, onDone, onError } = useMutation(PerformerCreateDocument)
      await mutate({
        registrationId,
        performer: <PerformerInput>{
          city: 'Winnipeg',
          province: 'MB',
        },
      })
      onDone((result) => {
        addToStore(<Performer>result.data.performerCreate.performer)
      })
      onError((error) => {
        console.log(error)
      })
    }

    // async function loadPerformers(registrationId: number) {
    //   return await new Promise((resolve, reject) => {
    //     const { onResult: resultLoadPerformers, onError } = useQuery(
    //       PERFORMER_INFO_QUERY,
    //       { registrationId },
    //       { fetchPolicy: 'no-cache' }
    //     )
    //     resultLoadPerformers((result) => {
    //       const clone = structuredClone(result.data.registration.performers)

    //       for (let i = 0; i < clone.length; i++) {
    //         delete clone[i].__typename
    //         addToStore(clone[i])
    //       }
    //       resolve(true)
    //     })
    //     onError((error) => {
    //       reject(error)
    //     })
    //   })
    // }

    function loadPerformers(registrationId: number) {
      const {
        result: resultPerformers,
        load: loadPerformer,
        onResult: resultLoadPerformers,
        onError: performerError,
      } = useLazyQuery(
        PerformerInfoDocument,
        { registrationId },
        { fetchPolicy: 'no-cache' }
      )
      resultLoadPerformers((result) => {
        const performers: Performer[] = result.data.registration.performers
        for (let i = 0; i < performers.length; i++) {
          addToStore(performers[i])
        }
      })
      performerError((error) => {
        console.log(error)
      })
      return {
        resultPerformers,
        loadPerformer,
      }
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
