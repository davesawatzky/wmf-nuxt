import * as Sentry from '@sentry/nuxt'

Sentry.init({
  dsn: useRuntimeConfig().public.sentryDsn,
  integrations: [
    Sentry.consoleLoggingIntegration({ levels: ['warn', 'error'] }),
    // Sentry.replayIntegration({
    //   maskAllText: true,
    //   blockAllMedia: true,
    // }),
  ],
  // replaysSessionSampleRate: 1.0,
  // replaysOnErrorSampleRate: 1.0,
  enableLogs: true,
  sendDefaultPii: true,
  tracesSampleRate: 0.5,
})
