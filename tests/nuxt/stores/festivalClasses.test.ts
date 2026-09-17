import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { festivalClasses } from '../../../app/stores/festivalClasses'

describe('festivalClasses store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with a single empty description', () => {
    const store = festivalClasses()

    expect(store.descriptions).toHaveLength(1)
    expect(store.descriptions[0]).toMatchObject({
      classDescription: '',
      subdisciplineDescription: '',
      categoryDescription: '',
      levelDescription: '',
      requiredSelection: '',
      trophyDescriptions: [{ name: '', description: '' }],
    })
  })

  it('addDescriptions appends another empty description', () => {
    const store = festivalClasses()

    store.addDescriptions()

    expect(store.descriptions).toHaveLength(2)
  })

  it('removeDescription removes the description at the given index', () => {
    const store = festivalClasses()
    store.addDescriptions()
    store.descriptions[0]!.classDescription = 'first'
    store.descriptions[1]!.classDescription = 'second'

    store.removeDescription(0)

    expect(store.descriptions).toHaveLength(1)
    expect(store.descriptions[0]!.classDescription).toBe('second')
  })

  it('removeDescription logs an error and leaves the array untouched for an invalid index', () => {
    const store = festivalClasses()

    store.removeDescription(5)

    expect(store.descriptions).toHaveLength(1)
  })

  it('$reset restores a single empty description', () => {
    const store = festivalClasses()
    store.addDescriptions()
    store.descriptions[0]!.classDescription = 'changed'

    store.$reset()

    expect(store.descriptions).toHaveLength(1)
    expect(store.descriptions[0]!.classDescription).toBe('')
  })
})
