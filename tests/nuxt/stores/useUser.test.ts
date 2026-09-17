import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useUser } from '../../../app/stores/useUser'

describe('useUser', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with an empty default user', () => {
    const store = useUser()

    expect(store.user).toMatchObject({
      id: 0,
      firstName: null,
      lastName: null,
      isActive: false,
      email: null,
      emailConfirmed: false,
    })
  })

  it('addToStore fills in defaults for missing fields', () => {
    const store = useUser()

    store.addToStore({ id: 5, firstName: 'Dave' })

    expect(store.user).toMatchObject({
      id: 5,
      firstName: 'Dave',
      lastName: null,
      isActive: false,
      email: null,
    })
  })

  it('addToStore keeps provided values', () => {
    const store = useUser()

    store.addToStore({
      id: 7,
      firstName: 'Ann',
      lastName: 'Lee',
      email: 'ann@example.com',
      isActive: true,
    })

    expect(store.user).toMatchObject({
      id: 7,
      firstName: 'Ann',
      lastName: 'Lee',
      email: 'ann@example.com',
      isActive: true,
    })
  })

  it('$reset restores the default empty user', () => {
    const store = useUser()
    store.addToStore({ id: 9, firstName: 'Temp' })

    store.$reset()

    expect(store.user).toMatchObject({ id: 0, firstName: null })
  })

  it('checkPassword defaults to null when no password check has been loaded', () => {
    const store = useUser()
    expect(store.checkPassword).toBeNull()
  })
})
