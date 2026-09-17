import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { PerformerType } from '../../../app/graphql/gql/graphql'
import { useAppStore } from '../../../app/stores/appStore'
import { useFieldConfig } from '../../../app/stores/useFieldConfig'
import { useGroup } from '../../../app/stores/useGroup'

describe('useGroup', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with an empty group and zero errors', () => {
    const store = useGroup()
    expect(store.group).toEqual({})
    expect(store.groupErrors).toBe(0)
  })

  it('addToStore fills in defaults for missing fields', () => {
    const store = useGroup()

    store.addToStore({ id: 1, name: 'Quartet' })

    expect(store.group).toMatchObject({
      id: 1,
      name: 'Quartet',
      groupType: null,
      numberOfPerformers: null,
    })
  })

  it('findInitialGroupErrors counts null required fields', () => {
    useAppStore().performerType = PerformerType.GROUP
    const fieldConfigStore = useFieldConfig()
    fieldConfigStore.requiredFields = [
      { tableName: 'Group', fieldName: 'name', soloRequired: false, groupRequired: true, schoolRequired: false, communityRequired: false, customField: false },
    ]
    const store = useGroup()
    store.addToStore({ id: 1, name: null })

    store.findInitialGroupErrors()

    expect(store.groupErrors).toBe(1)
  })

  it('$reset restores an empty group and clears errors', () => {
    const store = useGroup()
    store.addToStore({ id: 1, name: 'Quartet' })
    store.groupErrors = 2

    store.$reset()

    expect(store.group).toEqual({})
    expect(store.groupErrors).toBe(0)
  })
})
