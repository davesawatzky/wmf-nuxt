import * as Sentry from '@sentry/nuxt'

Sentry.init({
  dsn: useRuntimeConfig().public.sentryDsn,
  integrations: [
    // send console.log, console.warn, and console.error calls as logs to Sentry
    Sentry.consoleLoggingIntegration({ levels: ['warn', 'error'] }),
  ],
  // Enable logs to be sent to Sentry
  enableLogs: true,
  sendDefaultPii: true,
  tracesSampleRate: 0.5,
})
