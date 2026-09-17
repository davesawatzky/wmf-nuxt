import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useNavigationHistory } from '../../../app/composables/useNavigationHistory'

describe('useNavigationHistory', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('clearUserSession', () => {
    it('replaces the browser history entry with /login', () => {
      const replaceStateSpy = vi.spyOn(window.history, 'replaceState')
      const { clearUserSession } = useNavigationHistory()

      clearUserSession()

      expect(replaceStateSpy).toHaveBeenCalledWith(null, '', '/login')
      replaceStateSpy.mockRestore()
    })

    it('completes without throwing when navigating away', () => {
      const { clearUserSession } = useNavigationHistory()

      expect(() => clearUserSession()).not.toThrow()
    })
  })

  describe('preventBackNavigation', () => {
    it('pushes the current location onto history', () => {
      const pushStateSpy = vi.spyOn(window.history, 'pushState')
      const { preventBackNavigation } = useNavigationHistory()

      preventBackNavigation()

      expect(pushStateSpy).toHaveBeenCalledWith(null, '', window.location.href)
      pushStateSpy.mockRestore()
    })

    it('re-pushes state whenever popstate fires', () => {
      const pushStateSpy = vi.spyOn(window.history, 'pushState')
      const { preventBackNavigation } = useNavigationHistory()

      preventBackNavigation()
      pushStateSpy.mockClear()
      window.dispatchEvent(new PopStateEvent('popstate'))

      expect(pushStateSpy).toHaveBeenCalledWith(null, '', window.location.href)
      pushStateSpy.mockRestore()
    })
  })
})
