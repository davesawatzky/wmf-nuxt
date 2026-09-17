import { describe, expect, it } from 'vitest'
import { extractNestedValues, updateNestedValue } from '../../../app/utils/functions'

describe('utils Functions', () => {
  describe('updateNestedValue', () => {
    it('should update a nested value in an object', () => {
      const data = {
        users: [
          { id: 1, name: 'John', active: true },
          { id: 2, name: 'Jane', active: false },
        ],
      }

      const result = updateNestedValue(
        data,
        'active', // keyToUpdate
        true, // newValue
        'id', // conditionKey
        2, // conditionValue
        'users', // targetKey
      )

      expect(result.users[1].active).toBe(true)
      expect(result.users[0].active).toBe(true) // unchanged
    })

    it('should handle array of objects without targetKey', () => {
      const data = [
        { id: 1, status: 'pending' },
        { id: 2, status: 'pending' },
      ]

      const result = updateNestedValue(
        data,
        'status', // keyToUpdate
        'approved', // newValue
        'id', // conditionKey
        1, // conditionValue
      )

      expect(result[0].status).toBe('approved')
      expect(result[1].status).toBe('pending')
    })

    it('should return original data if condition not met', () => {
      const data = {
        items: [{ id: 1, value: 'original' }],
      }

      const result = updateNestedValue(
        data,
        'value',
        'new',
        'id',
        999, // non-existent id
        'items',
      )

      expect(result.items[0].value).toBe('original')
    })

    it('should handle nested object updates', () => {
      const data = {
        config: {
          settings: [
            { key: 'theme', value: 'light' },
            { key: 'lang', value: 'en' },
          ],
        },
      }

      const result = updateNestedValue(
        data,
        'value',
        'dark',
        'key',
        'theme',
        'config',
      )

      const themeValue = result.config.settings.find(
        s => s.key === 'theme',
      )?.value
      expect(themeValue).toBe('dark')
    })
  })

  describe('extractNestedValues', () => {
    it('extracts all values of a key from a nested structure', () => {
      const data = {
        users: [
          { id: 1, name: 'John' },
          { id: 2, name: 'Jane' },
        ],
      }

      const result = extractNestedValues<number>(data, 'id')
      expect(result).toEqual(new Set([1, 2]))
    })

    it('deduplicates identical object values', () => {
      const data = [{ tag: { id: 1 } }, { tag: { id: 1 } }]
      const result = extractNestedValues<{ id: number }>(data, 'tag')
      expect(result.size).toBe(1)
    })

    it('returns an empty set when the key is not found', () => {
      const result = extractNestedValues(({ a: 1 }), 'missing')
      expect(result).toEqual(new Set())
    })

    it('narrows the search using a targetContainerKey', () => {
      const data = {
        classes: [{ selections: [{ id: 1 }, { id: 2 }] }],
        other: [{ id: 99 }],
      }
      const result = extractNestedValues<number>(data, 'id', 'selections')
      expect(result).toEqual(new Set([1, 2]))
    })

    it('navigates a searchPath before extracting values', () => {
      const data = {
        a: { b: { items: [{ id: 5 }, { id: 6 }] } },
      }
      const result = extractNestedValues<number>(data, 'id', undefined, 'a.b.items')
      expect(result).toEqual(new Set([5, 6]))
    })

    it('returns an empty set when the searchPath does not exist', () => {
      const result = extractNestedValues({ a: {} }, 'id', undefined, 'a.b.c')
      expect(result).toEqual(new Set())
    })
  })
})
