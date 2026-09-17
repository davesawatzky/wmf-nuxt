import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { PerformerType } from '../../../app/graphql/gql/graphql'
import { useAppStore } from '../../../app/stores/appStore'
import { useCommunity } from '../../../app/stores/useCommunity'
import { useFieldConfig } from '../../../app/stores/useFieldConfig'

describe('useCommunity', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with a default empty community in Winnipeg, MB', () => {
    const store = useCommunity()

    expect(store.community).toMatchObject({
      id: 0,
      name: null,
      city: 'Winnipeg',
      province: 'MB',
    })
    expect(store.communityErrors).toBe(0)
  })

  it('addToStore fills in defaults for missing fields', () => {
    const store = useCommunity()

    store.addToStore({ id: 3, name: 'Community Choir' })

    expect(store.community).toMatchObject({
      id: 3,
      name: 'Community Choir',
      city: 'Winnipeg',
      province: 'MB',
      address: null,
    })
  })

  it('addToStore keeps provided city and province', () => {
    const store = useCommunity()

    store.addToStore({ id: 4, city: 'Brandon', province: 'MB' })

    expect(store.community.city).toBe('Brandon')
  })

  it('findInitialCommunityErrors counts null required fields', () => {
    useAppStore().performerType = PerformerType.COMMUNITY
    const fieldConfigStore = useFieldConfig()
    fieldConfigStore.requiredFields = [
      { tableName: 'Community', fieldName: 'name', soloRequired: false, groupRequired: false, schoolRequired: false, communityRequired: true, customField: false },
      { tableName: 'Community', fieldName: 'phone', soloRequired: false, groupRequired: false, schoolRequired: false, communityRequired: true, customField: false },
    ]
    const store = useCommunity()
    store.addToStore({ id: 1, name: null, phone: '204-555-0000' })

    store.findInitialCommunityErrors()

    expect(store.communityErrors).toBe(1)
  })

  it('$reset restores the default community and clears errors', () => {
    const store = useCommunity()
    store.addToStore({ id: 5, name: 'Test' })
    store.communityErrors = 3

    store.$reset()

    expect(store.community).toMatchObject({ id: 0, name: null })
    expect(store.communityErrors).toBe(0)
  })
})
