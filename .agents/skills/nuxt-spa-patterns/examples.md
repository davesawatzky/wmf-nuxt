# WMF Nuxt SPA Examples

## Authenticated Registrations Page

```vue
<!-- app/pages/Registrations.vue -->
<script setup lang="ts">
import { RegistrationsDocument } from '~/graphql/gql/graphql'
import { useToast } from 'vue-toastification'

definePageMeta({
  middleware: ['user'],
})

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

<template>
  <section>
    <PVButton
      label="Refresh"
      :loading="loading"
      @click="refetch()"
    />
    <p v-if="loading">Loading registrations...</p>
    <p v-else-if="registrations.length === 0">No registrations found.</p>
  </section>
</template>
```

## Global Token Validation

```ts
// app/middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
  const publicRoutes = ['/login', '/emailconfirmation']
  if (publicRoutes.includes(to.path)) {
    return
  }

  const { load, refetch } = useLazyQuery(gql`
    query TokenCheck {
      tokenCheck {
        user {
          id
          email
          isActive
          roles
          permissions
        }
        userErrors {
          message
        }
      }
    }
  `)

  const result = (await load()) || (await refetch())
  const user = result?.tokenCheck?.user

  if (!user || result?.tokenCheck?.userErrors?.length) {
    return navigateTo('/login', { replace: true })
  }

  const authStore = useAuthStore()
  authStore.setUser(user)

  if (!authStore.canAccessRoute(to.path, user.roles)) {
    return navigateTo('/login', { replace: true })
  }
})
```

This is a navigation guard only. The Nest backend must authorize every protected GraphQL operation.

## Registration Workflow Middleware

```ts
// app/middleware/form.ts
export default defineNuxtRouteMiddleware(async () => {
  const registration = sessionStorage.getItem('registrations')

  if (!registration || !JSON.parse(registration).registrationId) {
    abortNavigation()
    await navigateTo('/registrations')
  }
})
```

Use workflow middleware to prevent invalid navigation within a registration, not to grant user privileges.

## Apollo Mutation With Explicit Feedback

```ts
<script setup lang="ts">
import { useToast } from 'vue-toastification'

const toast = useToast()
const { mutate: saveRegistration, loading } = useMutation(SaveRegistrationDocument)

async function submitRegistration(input: SaveRegistrationInput) {
  try {
    await saveRegistration({ input })
    toast.success('Registration saved.')
  }
  catch (error) {
    console.error('Error saving registration:', error)
    toast.error('Unable to save registration. Please try again.')
  }
}
</script>
```

Use generated operation types and documents from `~/graphql/gql/graphql`; after changing an operation or schema, run `pnpm codegen`.

## Server-Only Email Route

```ts
// server/api/send-email.post.ts
import nodemailer from 'nodemailer'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig(event)

  if (!body?.userEmail || !body?.registration?.confirmation) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Registration email details are required',
    })
  }

  const transporter = nodemailer.createTransport({
    host: config.sendingEmailServer,
    port: Number(config.sendingSmtpPort),
    secure: true,
    auth: {
      user: config.emailServerUserAccount,
      pass: config.sendingEmailPassword,
    },
  })

  await transporter.sendMail({
    from: config.sendingEmailAddress,
    to: body.userEmail,
    bcc: config.bccEmailAddress,
    subject: `WMFestival Registration - ${body.registration.confirmation}`,
    html: await renderSubmissionEmail(body),
  })

  return { message: 'Email sent' }
})
```

Keep mail credentials server-only. Errors should reach the caller so it can show an appropriate toast.

## Client-Only Browser API

```ts
<script setup lang="ts">
const isCompact = ref(false)

onMounted(() => {
  isCompact.value = window.matchMedia('(max-width: 639px)').matches
})
</script>
```

This project is an SPA, but `onMounted` remains the clearest lifecycle boundary for browser APIs and keeps code compatible with a future rendering-mode change.
