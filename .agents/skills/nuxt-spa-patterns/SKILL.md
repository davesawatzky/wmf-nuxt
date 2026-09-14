---
name: nuxt-spa-patterns
description: Use when working on WMF Nuxt rendering, pages, middleware, plugins, runtime config, or Nitro routes. This project is a Nuxt 4 SPA; use its GraphQL backend and client-side route guards rather than SSR or BFF patterns.
---

# WMF Nuxt SPA Patterns

## Project Model

WMF is a Nuxt 4 single-page application. `nuxt.config.ts` sets `ssr: false`; pages and route middleware run in the browser.

- The NestJS GraphQL backend at `NUXT_GRAPHQL_SERVER` (default `http://localhost:3000/graphql`) is the source of truth for persisted data and authorization.
- Apollo sends requests with `credentials: 'include'`. Authentication is a JWT in an httpOnly cookie; never store or manufacture a token in client state, `localStorage`, or `sessionStorage`.
- Pinia holds UI and registration-workflow state. User roles and permissions must only come from backend responses.
- CASL and Nuxt middleware improve the client experience; backend authorization remains mandatory.
- The app runs locally on port `3001`. Start the Nest backend from the sibling `wmf-nest` project when a change requires integration behavior.

## Rendering and Data Loading

Use Apollo composables and generated GraphQL documents for backend data. Do not add a Nitro proxy merely to reach the GraphQL backend, and do not edit generated files under `app/graphql/gql/`.

```vue
<script setup lang="ts">
import { RegistrationsDocument } from '~/graphql/gql/graphql'
import { useToast } from 'vue-toastification'

const toast = useToast()
const { result, loading, onError, refetch } = useQuery(
  RegistrationsDocument,
  null,
  () => ({
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  }),
)

const registrations = computed(() => result.value?.registrations ?? [])

onError((error) => {
  console.error('Error loading registrations:', error)
  toast.error('Error loading registrations. Please try again.')
})
</script>
```

- Use generated documents and types from `~/graphql/gql/graphql`.
- Make mutation and refetch behavior explicit; derive display values with `computed`.
- Provide loading, empty, and error states for user-visible queries.
- Preserve user-facing failures through the existing toast pattern. Log useful operation context without logging credentials or sensitive values.

`useFetch` and `useAsyncData` are client-only in this application. Use them for local Nitro endpoints only; use Apollo for the Nest GraphQL API.

## Route Middleware and Authorization

`app/middleware/auth.global.ts` validates the session with the backend `TokenCheck` query on non-public routes, stores the returned user in `useAuthStore`, and redirects unauthenticated or unauthorized users to `/login`.

```ts
// Page-level UX guard for an authenticated route
// app/pages/Registrations.vue
definePageMeta({
  middleware: ['user'],
})
```

- Keep publicly accessible paths in the global auth middleware's `publicRoutes` list.
- Add named middleware only for page-specific workflow or role checks, such as `form`, `submission`, `admin`, `manager`, or `user`.
- When rejecting navigation, use `return navigateTo('/login')` for unauthenticated users and `return abortNavigation()` for authenticated users who lack the required role; always `return` the result.
- Browser APIs such as `sessionStorage` are valid in this SPA middleware. Guard reusable browser-only code with `import.meta.client`.
- Never treat a middleware or CASL decision as a backend authorization substitute.

The auth store freezes user data returned by the server and derives CASL abilities from those roles and permissions. Do not set, modify, or derive roles or permissions from local UI input.

## Pages, Layouts, and Plugins

- Pages live in `app/pages/`; use `definePageMeta` for middleware and layouts.
- Shared layouts live in `app/layouts/`; the root application renders `<NuxtLayout>` and `<NuxtPage>`.
- Use `<script setup lang="ts">` and explicit interfaces for public props and state.
- PrimeVue components use the `PV` prefix. Reuse existing base and form components before adding new primitives.
- Client plugins belong in `app/plugins/`. The Apollo plugin provides the configured Apollo client with `provideApolloClient(useApollo().clients!.default!)`.
- Use `import.meta.client` for plugins or code that access browser-only APIs. Server-only work belongs in `server/`.

## Runtime Config and Security

`runtimeConfig` separates server-only secrets from browser-safe values in `runtimeConfig.public`.

```ts
const config = useRuntimeConfig()

// In app code, only public values are available.
const publicApiBase = config.public.apiBase
```

- Keep SMTP credentials, service passwords, and other secrets out of `runtimeConfig.public`.
- Do not expose a new secret through a client composable, Pinia store, or browser storage.
- The configured GraphQL endpoint and CSP explicitly support the backend and Stripe. Update configuration deliberately when adding a new external endpoint.

## Nitro Server Routes

The local `server/` directory is intentionally narrow. `server/api/send-email.post.ts` renders a registration summary email and sends it with Nodemailer using private runtime configuration.

Use a Nitro route only when the operation requires a server-side secret or Node-only dependency, such as sending mail. Validate the request payload before use, return a meaningful failure to the client, and do not use server routes to reimplement GraphQL authorization.

```ts
// server/api/example.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Request body is required',
    })
  }

  return { ok: true }
})
```

Server utilities live in `server/utils/` and are server-only. Do not import them into files under `app/`.

## Error Handling

- For expected query or mutation failures, log contextual details and show a toast with an actionable message.
- The `app/plugins/error-handler.ts` plugin reports Vue errors to the console; avoid swallowing errors silently.
- `app/error.vue` is the application-level error page and routes the user back to sign-in.
- Use `createError` for unrecoverable navigation or server-route failures; do not use it for ordinary GraphQL validation feedback.

## Change Checklist

1. Confirm the change runs only where intended: SPA client, client middleware, or Nitro server route.
2. For backend data, add or update a GraphQL operation and run `pnpm codegen`; do not edit generated output.
3. Preserve httpOnly-cookie authentication and backend-enforced authorization.
4. Use local store reset methods for temporary registration workflows.
5. Run the focused Vitest or Playwright check described in the project testing skills.
