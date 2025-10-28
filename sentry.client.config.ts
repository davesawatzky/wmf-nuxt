import * as Sentry from '@sentry/nuxt'

Sentry.init({
  dsn:
    process.env.NODE_ENV === 'production'
      ? useRuntimeConfig().public.sentryDsn
      : undefined,
  integrations: [
    // send console.log, console.warn, and console.error calls as logs to Sentry
    Sentry.consoleLoggingIntegration({ levels: ['warn', 'error'] }),
  ],
  // Enable logs to be sent to Sentry
  enableLogs: true,
  sendDefaultPii: true,
  tracesSampleRate: 0.5,
})
