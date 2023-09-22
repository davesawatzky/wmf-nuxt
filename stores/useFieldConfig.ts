import { defineStore } from 'pinia'
import { FieldConfigsDocument } from '~/graphql/gql/graphql'
import { useAppStore } from '@/stores/appStore'

interface FieldConfig {
  tableName: string
  fieldName: string
  soloRequired: boolean
  groupRequired: boolean
  schoolRequired: boolean
  communityRequired: boolean
  customField: boolean
  customFieldType?: string
}

type ColumnKey =
  | 'soloRequired'
  | 'groupRequired'
  | 'schoolRequired'
  | 'communityRequired'

export const useFieldConfig = defineStore(
  'fieldConfig',
  () => {
    const requiredFields = ref<FieldConfig[]>([])
    const appStore = useAppStore()
    function $reset() {
      requiredFields.value = []
    }

    function performerTypeFields(tableName: string): string[] {
      let fields = <string[]>[]
      let column: ColumnKey
      switch (appStore.performerType) {
        case 'SOLO':
          column = 'soloRequired'
          break
        case 'GROUP':
          column = 'groupRequired'
          break
        case 'SCHOOL':
          column = 'schoolRequired'
          break
        case 'COMMUNITY':
          column = 'communityRequired'
          break
      }
      fields = requiredFields.value
        .filter((el) => el.tableName === tableName)
        .filter((el) => el[column] === true)
        .map((el) => el.fieldName)
      return fields
    }

    function loadRequiredFields(): Promise<unknown> {
      return new Promise((resolve, reject) => {
        const {
          result: resultFieldConfigs,
          load,
          onError,
          onResult,
        } = useLazyQuery(FieldConfigsDocument, undefined, {
          fetchPolicy: 'network-only',
        })
        load()
        onResult((result) => {
          for (let i = 0; i < result.data.fieldConfigs.length; i++) {
            requiredFields.value.push(
              result.data.fieldConfigs[i] as FieldConfig
            )
          }
          resolve('Success')
        })
        onError((error) => {
          reject(console.log(error))
        })
      })
    }

    return {
      requiredFields,
      $reset,
      loadRequiredFields,
      performerTypeFields,
    }
  },
  {
    persist: true,
  }
)
