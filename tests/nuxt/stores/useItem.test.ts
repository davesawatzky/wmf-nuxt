import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useItemStore } from '../../../app/stores/useItem'

describe('useItemStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with an empty items array', () => {
    const store = useItemStore()
    expect(store.items).toEqual([])
  })

  it('exposes createItem and loadItems as functions', () => {
    const store = useItemStore()
    expect(typeof store.createItem).toBe('function')
    expect(typeof store.loadItems).toBe('function')
  })

  it('$reset clears any items already in the store', () => {
    const store = useItemStore()
    store.items.push({ id: 1 } as any, { id: 2 } as any)

    store.$reset()

    expect(store.items).toEqual([])
  })
})
