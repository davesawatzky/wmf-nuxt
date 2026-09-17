import { describe, expect, it } from 'vitest'
import { formattedCurrency, formattedDate, formattedTime } from '../../../app/composables/comps'

describe('comps', () => {
  describe('formattedDate', () => {
    it('formats a Date into the ddd, MMM DD, YYYY pattern', () => {
      const result = formattedDate(new Date(2024, 0, 15))
      expect(result?.value).toBe('Mon, Jan 15, 2024')
    })

    it('formats a date string', () => {
      const result = formattedDate('2024-06-01')
      expect(result?.value).toContain('2024')
    })

    it('returns undefined for a null value', () => {
      expect(formattedDate(null)).toBeUndefined()
    })

    it('returns undefined when no value is given', () => {
      expect(formattedDate()).toBeUndefined()
    })
  })

  describe('formattedTime', () => {
    it('formats a time string as h:mm a', () => {
      const result = formattedTime('2024-01-15T13:30:00')
      expect(result?.value).toBe('1:30 pm')
    })

    it('returns undefined for a null value', () => {
      expect(formattedTime(null)).toBeUndefined()
    })
  })

  describe('formattedCurrency', () => {
    it('formats a number as CAD currency', () => {
      expect(formattedCurrency(20)).toBe('$20.00')
    })

    it('formats zero correctly', () => {
      expect(formattedCurrency(0)).toBe('$0.00')
    })

    it('returns an empty string for null', () => {
      expect(formattedCurrency(null)).toBe('')
    })

    it('formats negative numbers', () => {
      expect(formattedCurrency(-5.5)).toContain('5.50')
    })
  })
})
