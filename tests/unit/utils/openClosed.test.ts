import { describe, expect, it } from 'vitest'
import { communityOpen, groupOpen, lateDatesAndCosts, schoolOpen, soloOpen } from '../../../app/utils/openClosed'

describe('openClosed', () => {
  it('exposes the registration open flags as booleans', () => {
    expect(soloOpen).toBeTypeOf('boolean')
    expect(groupOpen).toBeTypeOf('boolean')
    expect(schoolOpen).toBeTypeOf('boolean')
    expect(communityOpen).toBeTypeOf('boolean')
  })

  describe('lateDatesAndCosts', () => {
    it('defines an entry for every performer type', () => {
      expect(Object.keys(lateDatesAndCosts)).toEqual(['SOLO', 'GROUP', 'SCHOOL', 'COMMUNITY'])
    })

    it('has a cut-off date after the late date for every performer type', () => {
      for (const key of Object.keys(lateDatesAndCosts) as (keyof typeof lateDatesAndCosts)[]) {
        const { lateDate, cutOffDate } = lateDatesAndCosts[key]
        expect(cutOffDate.getTime()).toBeGreaterThan(lateDate.getTime())
      }
    })

    it('charges a positive late fee amount for every performer type', () => {
      for (const key of Object.keys(lateDatesAndCosts) as (keyof typeof lateDatesAndCosts)[]) {
        expect(lateDatesAndCosts[key].amount).toBeGreaterThan(0)
      }
    })
  })
})
