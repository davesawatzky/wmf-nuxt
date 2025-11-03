import { defineStore } from 'pinia'
import { FieldConfigsDocument } from '~/graphql/gql/graphql'
import { useAppStore } from '~/stores/appStore'

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

    const {
      load: requiredFieldsLoad,
      refetch: refetchRequiredFields,
      onError: onLoadRequiredFieldsError,
      onResult: onRequiredFieldsResult,
    } = useLazyQuery(FieldConfigsDocument, undefined, {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    })
    async function loadRequiredFields() {
      const loaded = await requiredFieldsLoad()
      if (!loaded) {
        await refetchRequiredFields()
      }
    }
    onRequiredFieldsResult((result) => {
      for (let i = 0; i < result.data.fieldConfigs.length; i++) {
        requiredFields.value.push(result.data.fieldConfigs[i] as FieldConfig)
      }
    })
    onLoadRequiredFieldsError((error) => {
      console.error(error)
    })

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
