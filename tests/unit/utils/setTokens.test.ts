import { beforeEach, describe, expect, it, vi } from 'vitest'
import { isauthenticated, removeToken, setToken } from '../../../app/utils/setTokens'

describe('setTokens', () => {
  beforeEach(() => {
    vi.mocked(sessionStorage.setItem).mockClear()
    vi.mocked(sessionStorage.removeItem).mockClear()
    vi.mocked(sessionStorage.getItem).mockReset().mockReturnValue(null)
  })

  describe('setToken', () => {
    it('stores the token under the diatonicToken key', () => {
      setToken('abc123')
      expect(sessionStorage.setItem).toHaveBeenCalledWith('diatonicToken', 'abc123')
    })
  })

  describe('removeToken', () => {
    it('removes the diatonicToken key', () => {
      removeToken()
      expect(sessionStorage.removeItem).toHaveBeenCalledWith('diatonicToken')
    })
  })

  describe('isauthenticated', () => {
    it('returns false when the stored token is an empty string', () => {
      vi.mocked(sessionStorage.getItem).mockReturnValue('')
      expect(isauthenticated()).toBe(false)
    })

    it('returns true when a non-empty token is stored', () => {
      vi.mocked(sessionStorage.getItem).mockReturnValue('abc123')
      expect(isauthenticated()).toBe(true)
    })

    it('returns true when the token is missing (null !== empty string)', () => {
      vi.mocked(sessionStorage.getItem).mockReturnValue(null)
      expect(isauthenticated()).toBe(true)
    })
  })
})
