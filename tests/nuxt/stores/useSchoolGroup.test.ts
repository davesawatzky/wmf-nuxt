import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { PerformerType } from '../../../app/graphql/gql/graphql'
import { useAppStore } from '../../../app/stores/appStore'
import { useFieldConfig } from '../../../app/stores/useFieldConfig'
import { useSchoolGroup } from '../../../app/stores/useSchoolGroup'

describe('useSchoolGroup', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with empty arrays', () => {
    const store = useSchoolGroup()
    expect(store.schoolGroup).toEqual([])
    expect(store.schoolGroupErrors).toEqual([])
  })

  it('addToStore appends a group and a matching error entry', () => {
    const store = useSchoolGroup()

    store.addToStore({ id: 1, name: 'Band' } as any)

    expect(store.schoolGroup).toHaveLength(1)
    expect(store.schoolGroup[0]).toMatchObject({ id: 1, name: 'Band' })
    expect(store.schoolGroupErrors).toEqual([{ id: 1, count: 0 }])
  })

  it('findInitialSchoolGroupErrors counts null required fields per group', () => {
    useAppStore().performerType = PerformerType.SCHOOL
    const fieldConfigStore = useFieldConfig()
    fieldConfigStore.requiredFields = [
      { tableName: 'SchoolGroup', fieldName: 'chaperones', soloRequired: false, groupRequired: false, schoolRequired: true, communityRequired: false, customField: false },
    ]
    const store = useSchoolGroup()
    store.addToStore({ id: 1, chaperones: null } as any)
    store.addToStore({ id: 2, chaperones: 2 } as any)

    store.findInitialSchoolGroupErrors()

    expect(store.schoolGroupErrors).toEqual([
      { id: 1, count: 1 },
      { id: 2, count: 0 },
    ])
  })

  it('$reset clears both arrays', () => {
    const store = useSchoolGroup()
    store.addToStore({ id: 1 } as any)

    store.$reset()

    expect(store.schoolGroup).toEqual([])
    expect(store.schoolGroupErrors).toEqual([])
  })
})
