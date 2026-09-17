import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { sumErrorsArray, useTabErrors } from '../../../app/composables/tabErrors'
import { useAppStore } from '../../../app/stores/appStore'

describe('sumErrorsArray', () => {
  it('sums the count property across an array', () => {
    expect(sumErrorsArray([{ count: 1 }, { count: 2 }])).toBe(3)
  })

  it('treats a missing count as zero', () => {
    expect(sumErrorsArray([{}])).toBe(0)
  })

  it('recursively sums nested selections', () => {
    const arr = [
      { count: 1, selections: [{ count: 2 }, { count: 3 }] },
      { count: 1 },
    ]
    expect(sumErrorsArray(arr)).toBe(7)
  })

  it('returns 0 for an empty array', () => {
    expect(sumErrorsArray([])).toBe(0)
  })
})

describe('useTabErrors', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('returns solo tab names when performerType is SOLO', () => {
    const appStore = useAppStore()
    appStore.performerType = 'SOLO' as any
    const tabErrors = useTabErrors()
    expect(Object.keys(tabErrors.value)).toEqual([
      'Performer',
      'Teacher',
      'Solo Classes',
      'Summary',
    ])
  })

  it('returns group tab names when performerType is GROUP', () => {
    const appStore = useAppStore()
    appStore.performerType = 'GROUP' as any
    const tabErrors = useTabErrors()
    expect(Object.keys(tabErrors.value)).toEqual([
      'Group',
      'Performers',
      'Teacher',
      'Group Classes',
      'Summary',
    ])
  })

  it('returns school tab names when performerType is SCHOOL', () => {
    const appStore = useAppStore()
    appStore.performerType = 'SCHOOL' as any
    const tabErrors = useTabErrors()
    expect(Object.keys(tabErrors.value)).toEqual([
      'School',
      'Teacher',
      'Groups',
      'School Classes',
      'Summary',
    ])
  })

  it('returns community tab names when performerType is COMMUNITY', () => {
    const appStore = useAppStore()
    appStore.performerType = 'COMMUNITY' as any
    const tabErrors = useTabErrors()
    expect(Object.keys(tabErrors.value)).toEqual([
      'Community',
      'Contact',
      'Groups',
      'Community Classes',
      'Summary',
    ])
  })

  it('returns an empty object for an unrecognized performerType', () => {
    const appStore = useAppStore()
    appStore.performerType = 'UNKNOWN' as any
    const tabErrors = useTabErrors()
    expect(tabErrors.value).toEqual({})
  })
})
