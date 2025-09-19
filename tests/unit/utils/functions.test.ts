import { describe, it, expect } from 'vitest'
import { updateNestedValue } from '../../../app/utils/functions'

describe('Utils Functions', () => {
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
        'users' // targetKey
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
        1 // conditionValue
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
        'items'
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
        'config'
      )

      const themeValue = result.config.settings.find(
        (s) => s.key === 'theme'
      )?.value
      expect(themeValue).toBe('dark')
    })
  })
})
