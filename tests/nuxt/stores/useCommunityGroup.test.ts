import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { PerformerType } from '../../../app/graphql/gql/graphql'
import { useAppStore } from '../../../app/stores/appStore'
import { useCommunityGroup } from '../../../app/stores/useCommunityGroup'
import { useFieldConfig } from '../../../app/stores/useFieldConfig'

describe('useCommunityGroup', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with empty arrays', () => {
    const store = useCommunityGroup()
    expect(store.communityGroup).toEqual([])
    expect(store.communityGroupErrors).toEqual([])
  })

  it('addToStore appends a group and a matching error entry', () => {
    const store = useCommunityGroup()

    store.addToStore({ id: 1, name: 'Choir Group' } as any)

    expect(store.communityGroup).toHaveLength(1)
    expect(store.communityGroup[0]).toMatchObject({ id: 1, name: 'Choir Group' })
    expect(store.communityGroupErrors).toEqual([{ id: 1, count: 0 }])
  })

  it('findInitialCommunityGroupErrors counts null required fields per group', () => {
    useAppStore().performerType = PerformerType.COMMUNITY
    const fieldConfigStore = useFieldConfig()
    fieldConfigStore.requiredFields = [
      { tableName: 'CommunityGroup', fieldName: 'groupSize', soloRequired: false, groupRequired: false, schoolRequired: false, communityRequired: true, customField: false },
    ]
    const store = useCommunityGroup()
    store.addToStore({ id: 1, groupSize: null } as any)
    store.addToStore({ id: 2, groupSize: 10 } as any)

    store.findInitialCommunityGroupErrors()

    expect(store.communityGroupErrors).toEqual([
      { id: 1, count: 1 },
      { id: 2, count: 0 },
    ])
  })

  it('$reset clears both arrays', () => {
    const store = useCommunityGroup()
    store.addToStore({ id: 1 } as any)

    store.$reset()

    expect(store.communityGroup).toEqual([])
    expect(store.communityGroupErrors).toEqual([])
  })
})
