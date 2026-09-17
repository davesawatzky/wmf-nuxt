import { describe, expect, it } from 'vitest'
import { prefixes, provinces, textAreaLabel, WMFNumber } from '../../../app/utils/formData'

describe('formData', () => {
  describe('provinces', () => {
    it('contains all 13 provinces and territories', () => {
      expect(provinces).toHaveLength(13)
    })

    it('includes Manitoba', () => {
      expect(provinces).toContainEqual({ id: '4', name: 'MB' })
    })

    it('has unique ids', () => {
      const ids = provinces.map(p => p.id)
      expect(new Set(ids).size).toBe(ids.length)
    })
  })

  describe('prefixes', () => {
    it('contains the expected name prefixes', () => {
      expect(prefixes.map(p => p.name)).toEqual(['Mr.', 'Mrs.', 'Ms.', 'Dr.'])
    })
  })

  describe('textAreaLabel', () => {
    it('is a non-empty string', () => {
      expect(typeof textAreaLabel).toBe('string')
      expect(textAreaLabel.length).toBeGreaterThan(0)
    })
  })

  describe('wMFNumber', () => {
    it('formats the id with a WMF- prefix', () => {
      expect(WMFNumber(42)).toMatch(/^WMF-42-\d{4}$/)
    })

    it('appends a random 4-digit suffix between 1000 and 9999', () => {
      const result = WMFNumber(1)
      const suffix = Number(result.split('-')[2])
      expect(suffix).toBeGreaterThanOrEqual(1000)
      expect(suffix).toBeLessThanOrEqual(9999)
    })
  })
})
