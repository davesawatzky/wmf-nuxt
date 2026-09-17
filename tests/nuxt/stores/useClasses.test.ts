import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { PerformerType } from '../../../app/graphql/gql/graphql'
import { useAppStore } from '../../../app/stores/appStore'
import { useClasses } from '../../../app/stores/useClasses'
import { useFieldConfig } from '../../../app/stores/useFieldConfig'

describe('useClasses', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with empty classes and errors', () => {
    const store = useClasses()
    expect(store.registeredClasses).toEqual([])
    expect(store.classErrors).toEqual([])
  })

  it('addClassToStore fills in defaults and creates a matching error entry', () => {
    const store = useClasses()

    store.addClassToStore({ id: 10 } as any)

    expect(store.registeredClasses).toHaveLength(1)
    expect(store.registeredClasses[0]).toMatchObject({
      id: 10,
      classType: 'CLASS',
      price: 0.0,
      selections: [],
    })
    expect(store.classErrors).toEqual([{ id: 10, count: 0, selections: [] }])
  })

  it('addClassToStore seeds selection error entries from provided selections', () => {
    const store = useClasses()

    store.addClassToStore({
      id: 11,
      selections: [{ id: 100 }, { id: 101 }],
    } as any)

    expect(store.classErrors[0]!.selections).toEqual([
      { id: 100, count: 0 },
      { id: 101, count: 0 },
    ])
  })

  it('addSelectionToStore appends a selection to the matching class', () => {
    const store = useClasses()
    store.addClassToStore({ id: 10 } as any)

    store.addSelectionToStore({ id: 200, title: 'Sonata' } as any, 10)

    expect(store.registeredClasses[0]!.selections).toHaveLength(1)
    expect(store.registeredClasses[0]!.selections![0]).toMatchObject({ id: 200, title: 'Sonata' })
    expect(store.classErrors[0]!.selections).toEqual([{ id: 200, count: 0 }])
  })

  it('findInitialClassErrors counts null required class and selection fields', () => {
    useAppStore().performerType = PerformerType.SOLO
    const fieldConfigStore = useFieldConfig()
    fieldConfigStore.requiredFields = [
      { tableName: 'FestivalClasses', fieldName: 'classNumber', soloRequired: true, groupRequired: false, schoolRequired: false, communityRequired: false, customField: false },
      { tableName: 'FestivalClasses', fieldName: 'selections', soloRequired: true, groupRequired: false, schoolRequired: false, communityRequired: false, customField: false },
      { tableName: 'Selection', fieldName: 'title', soloRequired: true, groupRequired: false, schoolRequired: false, communityRequired: false, customField: false },
    ]
    const store = useClasses()
    store.addClassToStore({ id: 1, classNumber: null, selections: [{ id: 5, title: null }] } as any)

    store.findInitialClassErrors()

    expect(store.classErrors[0]!.count).toBe(1)
    expect(store.classErrors[0]!.selections[0]).toEqual({ id: 5, count: 1 })
  })

  it('totalClassErrors sums counts across classes and selections', () => {
    const store = useClasses()
    store.addClassToStore({ id: 1 } as any)
    store.classErrors[0]!.count = 2
    store.classErrors[0]!.selections.push({ id: 1, count: 3 })

    expect(store.totalClassErrors).toBe(5)
  })

  it('$reset clears classes and errors', () => {
    const store = useClasses()
    store.addClassToStore({ id: 1 } as any)

    store.$reset()

    expect(store.registeredClasses).toEqual([])
    expect(store.classErrors).toEqual([])
  })
})
