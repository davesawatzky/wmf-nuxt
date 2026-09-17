import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useOrders } from '../../../app/stores/useOrder'

describe('useOrders', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with an empty orders array', () => {
    const store = useOrders()
    expect(store.orders).toEqual([])
  })

  it('exposes createOrder as a function', () => {
    const store = useOrders()
    expect(typeof store.createOrder).toBe('function')
  })

  it('$reset clears any orders already in the store', () => {
    const store = useOrders()
    store.orders.push({ id: 1 } as any)

    store.$reset()

    expect(store.orders).toEqual([])
  })
})
