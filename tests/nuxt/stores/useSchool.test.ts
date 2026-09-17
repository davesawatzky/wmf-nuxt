import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { PerformerType } from '../../../app/graphql/gql/graphql'
import { useAppStore } from '../../../app/stores/appStore'
import { useFieldConfig } from '../../../app/stores/useFieldConfig'
import { useSchool } from '../../../app/stores/useSchool'

describe('useSchool', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with a default empty school in Winnipeg, MB', () => {
    const store = useSchool()

    expect(store.school).toMatchObject({
      id: 0,
      name: null,
      city: 'Winnipeg',
      province: 'MB',
    })
    expect(store.schoolErrors).toBe(0)
  })

  it('addToStore fills in defaults for missing fields', () => {
    const store = useSchool()

    store.addToStore({ id: 2, name: 'River Heights School' })

    expect(store.school).toMatchObject({
      id: 2,
      name: 'River Heights School',
      city: 'Winnipeg',
      province: 'MB',
      division: null,
    })
  })

  it('findInitialSchoolErrors counts null required fields', () => {
    useAppStore().performerType = PerformerType.SCHOOL
    const fieldConfigStore = useFieldConfig()
    fieldConfigStore.requiredFields = [
      { tableName: 'School', fieldName: 'division', soloRequired: false, groupRequired: false, schoolRequired: true, communityRequired: false, customField: false },
    ]
    const store = useSchool()
    store.addToStore({ id: 1, division: null })

    store.findInitialSchoolErrors()

    expect(store.schoolErrors).toBe(1)
  })

  it('$reset restores the default school and clears errors', () => {
    const store = useSchool()
    store.addToStore({ id: 3, name: 'Test' })
    store.schoolErrors = 2

    store.$reset()

    expect(store.school).toMatchObject({ id: 0, name: null })
    expect(store.schoolErrors).toBe(0)
  })
})
