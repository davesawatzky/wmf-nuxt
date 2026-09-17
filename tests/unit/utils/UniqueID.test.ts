import { describe, expect, it } from 'vitest'
import useUniqueID from '../../../app/utils/UniqueID'

describe('useUniqueID', () => {
  it('returns a getID function', () => {
    const { getID } = useUniqueID()
    expect(typeof getID).toBe('function')
  })

  it('returns ids as strings', () => {
    const { getID } = useUniqueID()
    expect(typeof getID()).toBe('string')
  })

  it('increments the id on each call', () => {
    const { getID } = useUniqueID()
    const first = Number(getID())
    const second = Number(getID())
    expect(second).toBe(first + 1)
  })

  it('shares the counter across separate calls to the composable', () => {
    const first = useUniqueID().getID()
    const second = useUniqueID().getID()
    expect(Number(second)).toBe(Number(first) + 1)
  })
})
