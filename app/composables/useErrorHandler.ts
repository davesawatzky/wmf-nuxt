import type { SeverityLevel } from '@sentry/nuxt'
import * as Sentry from '@sentry/nuxt'
import { useToast } from 'primevue/usetoast'

type ErrorSeverity = SeverityLevel
type ToastSeverity = 'error' | 'warn' | 'info' | 'success'

interface HandleErrorOptions {
  /** Message shown to user in toast. Omit to suppress toast. */
  userMessage?: string
  /** Toast severity (default: 'error') */
  toastSeverity?: ToastSeverity
  /** Sentry severity level (default: 'error') */
  level?: ErrorSeverity
  /** Operation name for Sentry context (e.g. 'saveAccount', 'addTicketOrder') */
  operation?: string
  /** Extra structured data sent to Sentry */
  context?: Record<string, unknown>
  /** Toast display duration in milliseconds (default: 5000) */
  life?: number
  /** If true, throws the error after handling (default: false) */
  rethrow?: boolean
}

/**
 * Composable providing a consistent error handling pattern.
 *
 * Logs the error to the console, reports it to Sentry with optional
 * severity/context metadata, and optionally displays a PrimeVue toast
 * notification to the user.
 *
 * Must be called inside a Vue component setup context (requires `useToast()`).
 * For Pinia stores, use {@link captureStoreError} instead.
 *
 * @returns An object containing the {@link handleError} function.
 *
 * @example
 * ```ts
 * const { handleError } = useErrorHandler()
 *
 * try {
 *   await doSomething()
 * } catch (error) {
 *   handleError(error, {
 *     userMessage: 'Failed to save account',
 *     operation: 'saveAccount',
 *   })
 * }
 * ```
 */
export function useErrorHandler() {
  const toast = useToast()

  /**
   * Handles an error by logging, reporting to Sentry, and optionally showing a toast.
   *
   * @param error - The caught error (can be any type; `Error` instances are sent to
   *   Sentry via `captureException`, other values via `captureMessage`).
   * @param options - Configuration for how the error is handled.
   * @param options.userMessage - Message shown to the user in a toast. Omit to suppress the toast.
   * @param options.toastSeverity - PrimeVue toast severity level. Defaults to `'error'`.
   * @param options.level - Sentry severity level. Defaults to `'error'`.
   * @param options.operation - Descriptive operation name for Sentry tags (e.g. `'saveAccount'`).
   * @param options.context - Extra structured data attached to the Sentry event.
   * @param options.rethrow - If `true`, re-throws the error after handling. Defaults to `false`.
   * @throws Re-throws the original error when `options.rethrow` is `true`.
   */
  function handleError( error: unknown, options: HandleErrorOptions = {}): void {
    const {
      userMessage,
      toastSeverity = 'error',
      level = 'error',
      operation,
      context,
      life,
      rethrow = false,
    } = options

    // Always log to console
    const prefix = operation ? `[${operation}]` : '[Error]'
    console.error( prefix, error )

    // Report to Sentry
    reportToSentry( error, { level, operation, context })

    // Show toast if a user-facing message was provided
    if ( userMessage ) {
      toast.add({
        severity: toastSeverity,
        summary: toastSeverity === 'error' ? 'Error' : toastSeverity === 'warn' ? 'Warning' : 'Info',
        detail: userMessage,
        life: life ?? 5000,
      })
    }

    if ( rethrow ) {
      throw error
    }
  }

  return { handleError }
}

/**
 * Standalone error handler for use in Pinia stores where `useToast()` is unavailable.
 *
 * Logs the error to the console, reports it to Sentry, and throws a Nuxt
 * error (via `createError`) so the calling code can handle it.
 *
 * @param error - The caught error value.
 * @param options - Configuration for error handling and the thrown Nuxt error.
 * @param options.operation - Descriptive operation name used for console logging and Sentry tags.
 * @param options.context - Extra structured data attached to the Sentry event.
 * @param options.statusCode - HTTP status code for the thrown error. Defaults to `500`.
 * @param options.statusMessage - Custom status message. Defaults to `'Failed: <operation>'`.
 * @throws Always throws a Nuxt error created via `createError()`.
 *
 * @example
 * ```ts
 * import { captureStoreError } from '~/composables/useErrorHandler'
 *
 * // Inside a Pinia store action
 * try {
 *   await $fetch('/api/accounts', { method: 'POST', body: data })
 * } catch (error) {
 *   captureStoreError(error, {
 *     operation: 'createAccount',
 *     context: { accountData: data },
 *   })
 * }
 * ```
 */
export function captureStoreError(
  error: unknown,
  options: { operation: string, context?: Record<string, unknown> } & { statusCode?: number, statusMessage?: string },
): never {
  const { operation, context, statusCode = 500, statusMessage } = options

  console.error( `[${operation}]`, error )
  reportToSentry( error, { level: 'error', operation, context })

  throw createError({
    statusCode,
    statusMessage: statusMessage || `Failed: ${operation}`,
    cause: error,
  })
}

/**
 * Internal helper that reports an error to Sentry within an isolated scope.
 *
 * If `error` is an `Error` instance it is sent via `Sentry.captureException`;
 * otherwise it is stringified and sent via `Sentry.captureMessage`.
 *
 * @param error - The error value to report.
 * @param meta - Metadata attached to the Sentry scope.
 * @param meta.level - Sentry severity level (e.g. `'error'`, `'warning'`).
 * @param meta.operation - Operation name set as a Sentry tag.
 * @param meta.context - Structured data attached as Sentry context under `'details'`.
 */
function reportToSentry(
  error: unknown,
  meta: { level?: ErrorSeverity, operation?: string, context?: Record<string, unknown> },
): void {
  Sentry.withScope(( scope ) => {
    if ( meta.level )
      scope.setLevel( meta.level )
    if ( meta.operation )
      scope.setTag( 'operation', meta.operation )
    if ( meta.context )
      scope.setContext( 'details', meta.context )

    if ( error instanceof Error ) {
      Sentry.captureException( error )
    } else {
      Sentry.captureMessage( String( error ), meta.level || 'error' )
    }
  })
}
