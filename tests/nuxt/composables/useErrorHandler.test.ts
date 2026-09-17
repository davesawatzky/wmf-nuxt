import * as Sentry from '@sentry/nuxt'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { captureStoreError, useErrorHandler } from '../../../app/composables/useErrorHandler'

const toastAdd = vi.fn()

vi.mock('primevue/usetoast', () => ({
  useToast: vi.fn(() => ({ add: toastAdd })),
}))

vi.mock('@sentry/nuxt', () => ({
  withScope: vi.fn((callback: (scope: any) => void) => {
    const scope = { setLevel: vi.fn(), setTag: vi.fn(), setContext: vi.fn() }
    callback(scope)
  }),
  captureException: vi.fn(),
  captureMessage: vi.fn(),
}))

describe('useErrorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('handleError', () => {
    it('reports Error instances to Sentry via captureException', () => {
      const { handleError } = useErrorHandler()
      const error = new Error('boom')

      handleError(error, { operation: 'saveAccount' })

      expect(Sentry.withScope).toHaveBeenCalled()
      expect(Sentry.captureException).toHaveBeenCalledWith(error)
    })

    it('reports non-Error values to Sentry via captureMessage', () => {
      const { handleError } = useErrorHandler()

      handleError('a string error', { level: 'warning' })

      expect(Sentry.captureMessage).toHaveBeenCalledWith('a string error', 'warning')
    })

    it('shows a toast when userMessage is provided', () => {
      const { handleError } = useErrorHandler()

      handleError(new Error('boom'), { userMessage: 'Something went wrong' })

      expect(toastAdd).toHaveBeenCalledWith(expect.objectContaining({
        severity: 'error',
        summary: 'Error',
        detail: 'Something went wrong',
        life: 5000,
      }))
    })

    it('does not show a toast when userMessage is omitted', () => {
      const { handleError } = useErrorHandler()

      handleError(new Error('boom'))

      expect(toastAdd).not.toHaveBeenCalled()
    })

    it('rethrows the error when rethrow is true', () => {
      const { handleError } = useErrorHandler()
      const error = new Error('boom')

      expect(() => handleError(error, { rethrow: true })).toThrow(error)
    })

    it('uses the provided toast severity and life', () => {
      const { handleError } = useErrorHandler()

      handleError(new Error('boom'), {
        userMessage: 'careful',
        toastSeverity: 'warn',
        life: 1000,
      })

      expect(toastAdd).toHaveBeenCalledWith(expect.objectContaining({
        severity: 'warn',
        summary: 'Warning',
        detail: 'careful',
        life: 1000,
      }))
    })
  })

  describe('captureStoreError', () => {
    it('always throws a Nuxt error', () => {
      expect(() => captureStoreError(new Error('db failed'), { operation: 'createAccount' })).toThrow()
    })

    it('reports to Sentry before throwing', () => {
      try {
        captureStoreError(new Error('db failed'), { operation: 'createAccount' })
      }
      catch {
        // expected
      }

      expect(Sentry.captureException).toHaveBeenCalled()
    })
  })
})
