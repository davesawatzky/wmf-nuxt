import * as Sentry from '@sentry/nuxt'

export default defineNuxtPlugin(( nuxtApp ) => {
  // The @sentry/nuxt module already captures unhandled Vue errors
  // via Nuxt's built-in error hooks. We must NOT override
  // vueApp.config.errorHandler — doing so would break that chain.
  //
  // This hook adds structured context (component name, route) to
  // Sentry's scope so the auto-captured error is more useful.
  // It does NOT call captureException — Sentry handles that.
  nuxtApp.hook( 'vue:error', ( error, instance, info ) => {
    const componentName = instance?.$options?.name
      || instance?.$options?.__name
      || 'UnknownComponent'

    console.error( `[Vue Error] ${info} in <${componentName}>:`, error )

    // Enrich future events with component and route info
    Sentry.getCurrentScope().setTag( 'vue.component', componentName )
    Sentry.getCurrentScope().setTag( 'vue.info', info )

    if ( instance ) {
      const route = instance.$route
      if ( route ) {
        Sentry.getCurrentScope().setContext( 'route', {
          path: route.path,
          name: route.name as string,
          params: route.params,
        })
      }
    }
  })
})
