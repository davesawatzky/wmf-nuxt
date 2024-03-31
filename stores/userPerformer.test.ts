import { createPinia, setActivePinia } from 'pinia'
import { expect } from 'vitest'
import {
  testFullPerformer1,
  testFullPerformer2,
  testPartialPerformer,
} from './testData'
import { usePerformers } from '@/stores/userPerformer'

let performerStore: any

describe('performer Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    performerStore = usePerformers()
  })

  describe('addToStore', () => {
    it('adds a performer object to the store', () => {
      performerStore.addToStore(testFullPerformer1)
      expect(performerStore.performers[0]).toMatchObject(testFullPerformer1)
    })
    it('also accepts a partial performer', () => {
      performerStore.addToStore(testPartialPerformer)
      expect(performerStore.performers[0].email).toBe('')
    })
    it('adds the id as a number', () => {
      performerStore.addToStore(testFullPerformer1)
      expect(performerStore.performers[0].id).toBeTypeOf('number')
    })
  })

  it('resets the performer ref to empty', () => {
    performerStore.addToStore(testFullPerformer1)
    performerStore.addToStore(testFullPerformer2)
    performerStore.$reset()
    expect(performerStore.performers).is.empty
  })

  it('gets the full name of the performers', () => {
    performerStore.addToStore(testFullPerformer1)
    performerStore.addToStore(testFullPerformer2)
    const fullname = performerStore.fullName
    expect(fullname).toEqual(['Mikayla Sawatzky', 'Madelaine Thiessen'])
  })

  it('gets the average age of the performers', () => {
    performerStore.addToStore(testFullPerformer1)
    performerStore.addToStore(testFullPerformer2)
    const averageAge = performerStore.averageAge
    const avg = Math.round(
      (performerStore.performers[0].age + performerStore.performers[1].age) / 2,
    )
    expect(averageAge).toBeTypeOf('number')
    expect(averageAge).toBe(avg)
  })

  describe('create Performer', () => {
    it('creates one brand new performer', () => {})
  })
})
