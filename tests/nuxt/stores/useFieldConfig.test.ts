import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { PerformerType } from '../../../app/graphql/gql/graphql'
import { useAppStore } from '../../../app/stores/appStore'
import { useFieldConfig } from '../../../app/stores/useFieldConfig'

describe('useFieldConfig', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with no required fields', () => {
    const store = useFieldConfig()
    expect(store.requiredFields).toEqual([])
  })

  it('performerTypeFields filters fields by table name and the current performer type', () => {
    const appStore = useAppStore()
    appStore.performerType = PerformerType.SOLO
    const store = useFieldConfig()
    store.requiredFields = [
      { tableName: 'Performer', fieldName: 'firstName', soloRequired: true, groupRequired: false, schoolRequired: false, communityRequired: false, customField: false },
      { tableName: 'Performer', fieldName: 'age', soloRequired: false, groupRequired: true, schoolRequired: false, communityRequired: false, customField: false },
      { tableName: 'Teacher', fieldName: 'email', soloRequired: true, groupRequired: true, schoolRequired: true, communityRequired: true, customField: false },
    ]

    expect(store.performerTypeFields('Performer')).toEqual(['firstName'])
  })

  it('returns fields for the GROUP performer type when set', () => {
    const appStore = useAppStore()
    appStore.performerType = PerformerType.GROUP
    const store = useFieldConfig()
    store.requiredFields = [
      { tableName: 'Group', fieldName: 'name', soloRequired: false, groupRequired: true, schoolRequired: false, communityRequired: false, customField: false },
    ]

    expect(store.performerTypeFields('Group')).toEqual(['name'])
  })

  it('returns an empty array when no fields match the table name', () => {
    const store = useFieldConfig()
    store.requiredFields = [
      { tableName: 'Teacher', fieldName: 'email', soloRequired: true, groupRequired: true, schoolRequired: true, communityRequired: true, customField: false },
    ]

    expect(store.performerTypeFields('Performer')).toEqual([])
  })

  it('$reset clears the required fields', () => {
    const store = useFieldConfig()
    store.requiredFields = [
      { tableName: 'Teacher', fieldName: 'email', soloRequired: true, groupRequired: true, schoolRequired: true, communityRequired: true, customField: false },
    ]

    store.$reset()

    expect(store.requiredFields).toEqual([])
  })
})
