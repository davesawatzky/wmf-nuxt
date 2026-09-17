import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { PerformerType } from '../../../app/graphql/gql/graphql'
import { useAppStore } from '../../../app/stores/appStore'

describe('appStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with the expected defaults', () => {
    const store = useAppStore()

    expect(store.editExisting).toBe(false)
    expect(store.performerType).toBe(PerformerType.SOLO)
    expect(store.registrationExists).toBe(false)
    expect(store.dataLoading).toBe(false)
    expect(store.stripePayment).toBe('')
    expect(store.processingFee).toBe('')
  })

  it('allows updating individual state properties', () => {
    const store = useAppStore()

    store.performerType = PerformerType.GROUP
    store.editExisting = true
    store.dataLoading = true

    expect(store.performerType).toBe(PerformerType.GROUP)
    expect(store.editExisting).toBe(true)
    expect(store.dataLoading).toBe(true)
  })

  it('$reset restores every property to its default value', () => {
    const store = useAppStore()

    store.performerType = PerformerType.SCHOOL
    store.editExisting = true
    store.registrationExists = true
    store.dataLoading = true
    store.stripePayment = 'succeeded'
    store.processingFee = '2.50'

    store.$reset()

    expect(store.performerType).toBe(PerformerType.SOLO)
    expect(store.editExisting).toBe(false)
    expect(store.registrationExists).toBe(false)
    expect(store.dataLoading).toBe(false)
    expect(store.stripePayment).toBe('')
    expect(store.processingFee).toBe('')
  })
})
