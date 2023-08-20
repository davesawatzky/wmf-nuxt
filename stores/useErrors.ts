import { defineStore } from 'pinia'
import {
  FormErrorCreateDocument,
  FormErrorDeleteDocument,
  FormErrorDocument,
  FormErrorUpdateDocument,
} from '~/graphql/gql/graphql'
import type { FormError, FormErrorInput } from '~/graphql/gql/graphql'

export const useErrorStore = defineStore(
  'errorStore',
  () => {
    const errorField = ref<FormErrorInput>({
      classErrors: 0,
      groupInfoErrors: 0,
      groupPerformersErrors: 0,
      groupTeacherErrors: 0,
      soloPerformerErrors: 0,
      soloTeacherErrors: 0,
      schoolInfoErrors: 0,
      schoolTeacherErrors: 0,
      schoolGroupErrors: 0,
      schoolGroupsErrors: 0,
      communityInfoErrors: 0,
      communityTeacherErrors: 0,
    })

    const errorFieldKeys = Object.keys(errorField.value)

    function $reset() {
      errorField.value.classErrors = 0
      errorField.value.groupInfoErrors = 0
      errorField.value.groupPerformersErrors = 0
      errorField.value.groupTeacherErrors = 0
      errorField.value.soloPerformerErrors = 0
      errorField.value.soloTeacherErrors = 0
      errorField.value.schoolInfoErrors = 0
      errorField.value.schoolTeacherErrors = 0
      errorField.value.schoolGroupErrors = 0
      errorField.value.schoolGroupsErrors = 0
      errorField.value.communityInfoErrors = 0
      errorField.value.communityTeacherErrors = 0
    }

    function addToStore(formError: FormError) {
      for (const field of errorFieldKeys) {
        errorField.value[field as keyof FormErrorInput] =
          formError[field as keyof FormErrorInput] ?? 0
      }
    }

    const numberOfErrors = computed(() => {
      return Object.values(errorField.value).reduce((a, b) => {
        return a + b
      }, 0)
    })

    function createFormErrors(registrationID: number): Promise<unknown> {
      return new Promise((resolve, reject) => {
        const {
          mutate: formErrorCreate,
          onDone,
          onError,
        } = useMutation(FormErrorCreateDocument)
        formErrorCreate({
          registrationID,
          formError: <FormErrorInput>errorField.value,
        }).catch((error) => console.log(error))
        onDone((result) => {
          const formError: FormErrorInput =
            result.data.formErrorCreate.formError
          resolve('Success')
        })
        onError((error) => {
          reject(console.log(error))
        })
      })
    }

    function loadFormErrors(registrationId?: number): Promise<unknown> {
      return new Promise((resolve, reject) => {
        const {
          result: resultFormErrors,
          load,
          onError,
          onResult,
        } = useLazyQuery(
          FormErrorDocument,
          { registrationId },
          { fetchPolicy: 'network-only' }
        )
        load()
        onResult((result) => {
          addToStore(<FormError>result.data.formError)
          resolve('Success')
        })
        onError((error) => {
          reject(console.log(error))
        })
      })
    }

    function updateFormErrors(
      formErrorId: number,
      formErrorInput: FormErrorInput
    ): Promise<unknown> {
      return new Promise((resolve, reject) => {
        const {
          mutate: formErrorUpdate,
          onDone,
          onError,
        } = useMutation(FormErrorUpdateDocument, {
          fetchPolicy: 'network-only',
        })
        formErrorUpdate({
          formErrorId,
          formErrorInput,
        }).catch((error) => console.log(error))
        onDone(() => {
          resolve('Success')
        })
        onError((error) => {
          reject(console.log(error))
        })
      })
    }

    function deleteFormErrors(formErrorId: number): Promise<unknown> {
      return new Promise((resolve, reject) => {
        const {
          mutate: formErrorDelete,
          onDone,
          onError,
        } = useMutation(FormErrorDeleteDocument)
        formErrorDelete({ formErrorId }).catch((error) => console.log(error))
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
      $reset,
      createFormErrors,
      loadFormErrors,
      updateFormErrors,
      deleteFormErrors,
      errorField,
      numberOfErrors,
    }
  },
  {
    persist: true,
  }
)
