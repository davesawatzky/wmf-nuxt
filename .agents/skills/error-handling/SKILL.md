---
name: error-handling
description: Provides error handling patterns with Sentry integration for Nuxt 4 applications. Use when handling errors in components, stores, plugins, Nitro server routes, or configuring Sentry error reporting.
---

# Error Handling & Sentry Integration

## Architecture Overview

Error handling is layered with four tiers:

```
CLIENT SIDE:

1. Store catch   → captureStoreError()  (logs + Sentry + re-throws)
                      ↓
2. Component catch → handleError()       (logs + Sentry + toast)
                      ↓
3. Unhandled?      → plugins/error-handler.ts (scope enrichment)
                      → @sentry/nuxt auto-capture (sends to Sentry)
                      ↓
4. Fatal?          → error.vue           (full-page error)

SERVER SIDE (Nitro):

1. Server route    → createError()       (H3 error with statusCode)
                      ↓
2. Unhandled?      → @sentry/nuxt auto-capture (sends to Sentry)
                      ↓
3. Client receives → plugins/fetch.ts    (toast for 401/403/500)
                      → error.vue         (full-page for fatal SSR errors)
```

## Critical Rules

- **Never override `vueApp.config.errorHandler`** — the `@sentry/nuxt` module hooks into Nuxt's error system internally. Overriding it breaks Sentry's auto-capture.
- **Caught errors are NOT sent to Sentry automatically.** Once you `catch`, you own the error. Use `handleError()` or `captureStoreError()` to report explicitly.
- **Do not call `createError()` directly** in components or stores — use the composable/store helpers which ensure Sentry reporting and consistent UX.
- **HTTP errors (401, 403, 500)** are handled by `plugins/fetch.ts` — do not duplicate this logic.
- **On the server, use H3's `createError()`** — this is the correct pattern for Nitro routes/middleware. It produces proper HTTP responses that `plugins/fetch.ts` handles on the client.
- **Sentry severity levels:** `"fatal"`, `"error"`, `"warning"`, `"log"`, `"info"`, `"debug"`.

## Key Files

| File | Purpose |
|------|---------|
| `app/plugins/error-handler.ts` | Global plugin: enriches Sentry scope with component name and route context for unhandled errors |
| `app/composables/useErrorHandler.ts` | Exports `useErrorHandler()` for components and `captureStoreError()` for stores |
| `app/error.vue` | Full-page error display for fatal/navigation errors |
| `app/plugins/fetch.ts` | HTTP error handling (401 token refresh, 403 forbidden, 500 server errors) |
| `sentry.client.config.ts` | Sentry client SDK initialization |
| `sentry.server.config.ts` | Sentry server SDK initialization (public-web only — SSR app) |
| `server/plugins/*.ts` | Nitro server plugins (e.g., strip-cf-cookies) |

## Component Pattern — `useErrorHandler()`

Use `useErrorHandler()` in any component with async operations:

```typescript
const { handleError } = useErrorHandler()

async function saveAccount() {
  saving.value = true
  try {
    await accountMutations.accountUpdate(newAccount.value)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Account updated successfully',
      life: 3000,
    })
  } catch (error) {
    handleError(error, {
      userMessage: 'Failed to save account',    // shown in toast
      operation: 'saveAccount',                  // tagged in Sentry
      context: { accountId: newAccount.value.id }, // extra Sentry context
    })
  } finally {
    saving.value = false
  }
}
```

### `handleError()` options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `userMessage` | `string?` | — | Toast message. Omit to suppress toast. |
| `toastSeverity` | `'error' \| 'warn' \| 'info' \| 'success'` | `'error'` | PrimeVue toast severity |
| `level` | `SeverityLevel` | `'error'` | Sentry event level |
| `operation` | `string?` | — | Tagged in Sentry for filtering |
| `context` | `Record<string, unknown>?` | — | Extra structured data in Sentry |
| `rethrow` | `boolean` | `false` | Re-throw after handling |

## Pinia Store Pattern — `captureStoreError()`

Stores cannot use `useToast()` (no component context). Use the standalone `captureStoreError()` function instead:

```typescript
import { captureStoreError } from '~/composables/useErrorHandler'

export const useDonationsStore = defineStore('donations', () => {
  async function addDonationToOrderCollection() {
    try {
      await ordersStore.checkForExistingOrderCollection()
      const result = await donationMutations.donationCreate(newDonation.value)
      newDonation.value.id = result.id
      await addDonationOrder()
    } catch (error) {
      captureStoreError(error, {
        operation: 'addDonationToOrderCollection',
        statusCode: 422,
        statusMessage: 'Failed to add donation',
        context: { donationId: newDonation.value.id },
      })
      // captureStoreError always throws — code below is unreachable
    }
  }

  return { addDonationToOrderCollection }
})
```

`captureStoreError()` always:
1. Logs to console
2. Reports to Sentry with tags and context
3. Throws a `createError()` so the calling component's `catch` can show a toast

## Plugin Pattern — Scope Enrichment Only

The global plugin does NOT call `captureException`. It only enriches the Sentry scope:

```typescript
// plugins/error-handler.ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('vue:error', (error, instance, info) => {
    const componentName = instance?.$options?.name
      || instance?.$options?.__name
      || 'UnknownComponent'

    console.error(`[Vue Error] ${info} in <${componentName}>:`, error)

    Sentry.getCurrentScope().setTag('vue.component', componentName)
    Sentry.getCurrentScope().setTag('vue.info', info)

    if (instance?.$route) {
      Sentry.getCurrentScope().setContext('route', {
        path: instance.$route.path,
        name: instance.$route.name as string,
        params: instance.$route.params,
      })
    }
  })
})
```

---

## Server-Side (Nitro) Error Handling

Server-side code runs in the **Nitro** engine — a completely separate context from Vue. There is **no access** to Vue composables, PrimeVue toasts, Pinia stores, or component lifecycle on the server. Errors must be communicated to the client via HTTP status codes, where `plugins/fetch.ts` handles toast notifications.

### Sentry Server Configuration

Only needed for SSR apps (public-web). SPA apps (admin, `ssr: false`) do not execute server-side Vue rendering.

```typescript
// sentry.server.config.ts
import * as Sentry from '@sentry/nuxt'

Sentry.init({
  dsn: '<your-dsn>',
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.5 : 1.0,
  _experiments: {
    enableLogs: true,
  },
  integrations: [
    Sentry.consoleLoggingIntegration({
      levels: process.env.NODE_ENV === 'production'
        ? ['warn', 'error']
        : ['debug', 'info', 'warn', 'error', 'trace', 'log', 'assert'],
    }),
  ],
})
```

### Server API Route Pattern

Use H3's `createError()` to return proper HTTP error responses. Sentry auto-captures unhandled errors on the server, so you only need explicit `Sentry.captureException()` when you **catch and handle** an error.

```typescript
// server/api/example.post.ts
import * as Sentry from '@sentry/nuxt'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  try {
    const result = await someExternalService(body)
    return result
  } catch (error) {
    // Log + report to Sentry (caught errors are NOT auto-reported)
    console.error('[API] Failed to process request:', error)
    Sentry.captureException(error, {
      tags: { operation: 'example.post' },
      extra: { requestBody: body },
    })

    // Return HTTP error — client's fetch.ts handles the toast
    throw createError({
      statusCode: 502,
      statusMessage: 'External service unavailable',
    })
  }
})
```

### Server Middleware Pattern

Server middleware runs before route handlers. Use the same `createError()` pattern:

```typescript
// server/middleware/validate-api-key.ts
export default defineEventHandler((event) => {
  if (!event.path?.startsWith('/api/internal/')) return

  const apiKey = getHeader(event, 'x-api-key')
  if (!apiKey || apiKey !== useRuntimeConfig().internalApiKey) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid API key',
    })
  }
})
```

### Nitro Plugin Pattern — Error Enrichment

Nitro plugins can hook into the request lifecycle. Use `beforeResponse` or `afterResponse` for logging and Sentry context:

```typescript
// server/plugins/error-logger.ts
import * as Sentry from '@sentry/nuxt'

export default defineNitroPlugin((nitro) => {
  nitro.hooks.hook('error', (error, { event }) => {
    // Enrich Sentry scope with request context
    Sentry.withScope((scope) => {
      scope.setTag('server.route', event?.path || 'unknown')
      scope.setExtra('request.method', event?.method)
      Sentry.captureException(error)
    })
  })
})
```

### SSR-Aware Fetch Plugin

The `fetch.ts` plugin detects server vs client context. On the server (during SSR), it only forwards cookies — all error handling (toasts, redirects) happens on the client:

```typescript
// plugins/fetch.ts — SSR branch
export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.server) {
    // Server-side: forward cookies from the incoming request
    const headers = useRequestHeaders(['cookie'])
    const $fetch = nuxtApp.$fetch as typeof globalThis.$fetch
    globalThis.$fetch = $fetch.create({
      headers: { cookie: headers.cookie || '' },
    })
    return // No error handling on server — errors propagate as HTTP responses
  }

  // Client-side: handle 401/403/500 with toasts (existing pattern)
  // ...
})
```

### Server-to-Client Error Flow

The full error flow from server to client toast:

```
Server route throws createError({ statusCode: 500 })
    ↓
Nitro returns HTTP 500 response
    ↓
Client $fetch receives the error
    ↓
plugins/fetch.ts onResponseError fires
    ↓
handleServerErrorToast() shows PrimeVue toast
```

For **SSR rendering errors** (errors during server-side page render), Nuxt renders `error.vue` directly — the error never passes through `fetch.ts`.

## Anti-Patterns

### DON'T: Override Vue's error handler
```typescript
// ❌ WRONG — breaks Sentry's auto-capture
nuxtApp.vueApp.config.errorHandler = (error) => {
  Sentry.captureException(error)
}
```

### DON'T: Use createError() directly in components
```typescript
// ❌ WRONG — no Sentry reporting, no toast
catch (error) {
  throw createError({ statusCode: 500, message: 'Failed', cause: error })
}
```

### DON'T: Call captureException in the plugin
```typescript
// ❌ WRONG — double reports (Sentry already captures unhandled errors)
nuxtApp.hook('vue:error', (error) => {
  Sentry.captureException(error) // duplicate!
})
```

### DO: Use the composable in components
```typescript
// ✅ CORRECT
catch (error) {
  handleError(error, {
    userMessage: 'Failed to save',
    operation: 'saveAccount',
  })
}
```

### DO: Use captureStoreError in stores
```typescript
// ✅ CORRECT
catch (error) {
  captureStoreError(error, {
    operation: 'addDonation',
    statusCode: 422,
  })
}
```

### DON'T: Use Vue composables in server context
```typescript
// ❌ WRONG — useToast(), useNuxtApp(), usePinia() don't exist on the server
// server/api/example.ts
export default defineEventHandler(() => {
  const toast = useToast() // Runtime error!
})
```

### DON'T: Return generic errors without status codes
```typescript
// ❌ WRONG — throw Error doesn't produce a proper HTTP response
export default defineEventHandler(() => {
  throw new Error('Something failed') // Client sees opaque 500
})

// ✅ CORRECT — createError produces a structured HTTP error
export default defineEventHandler(() => {
  throw createError({
    statusCode: 422,
    statusMessage: 'Validation failed: email is required',
  })
})
```

### DON'T: Swallow errors silently on the server
```typescript
// ❌ WRONG — error is caught but neither reported nor re-thrown
export default defineEventHandler(async () => {
  try {
    return await externalApi()
  } catch (error) {
    console.log('failed') // No Sentry, no proper HTTP response
    return { ok: false }
  }
})

// ✅ CORRECT — report to Sentry and return proper HTTP error
export default defineEventHandler(async () => {
  try {
    return await externalApi()
  } catch (error) {
    Sentry.captureException(error)
    throw createError({ statusCode: 502, statusMessage: 'External service failed' })
  }
})
```
