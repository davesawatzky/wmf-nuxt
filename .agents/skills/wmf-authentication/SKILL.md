---
name: wmf-authentication
description: "Use when changing WMF Nuxt authentication, authorization, route protection, login, registration, email verification, password reset, or httpOnly cookie handling."
user-invocable: true
---

# WMF Authentication

## Architecture

- Authentication is session-based. JWTs remain in httpOnly cookies and are validated through the NestJS GraphQL API.
- `app/middleware/auth.global.ts` protects authenticated routes through the token-check flow.
- Keep private auth state behind the store's internal state mechanism. Expose readonly computed state from `useAuthStore()`.
- Treat roles and permissions as server-owned values. Do not set, modify, or derive roles/permissions in client state; only store values returned by the server. Client checks (CASL, middleware) are UX guards, not authorization.
- Enforce authorization on the backend as well as in client middleware and CASL rules.

## Implementation Rules

1. Use Apollo operations in `app/graphql/` for auth requests; do not introduce a second API client.
2. Preserve cookie credentials and the configured GraphQL endpoint in `nuxt.config.ts`.
3. Use the existing toast and navigation fallback patterns for expected auth errors.
4. After schema or operation changes, run `pnpm codegen`; never edit generated files under `app/graphql/gql/`.
5. Test successful, rejected, unverified, expired-token, and unauthorized-route states where the change affects them.

## Example

Read auth state through the public store; do not write a token or role in a component:

```ts
const auth = useAuthStore()

if (!auth.isAuthenticated) {
	await navigateTo('/login')
}

const canManageRegistrations = auth.can('manage', 'Registration')
```

## Verification

- Unit or Nuxt tests should mock GraphQL operations and assert store and middleware behavior.
- Full auth flows require the `wmf-nest` backend on `localhost:3000`.
- MailHog-backed email flows and the predefined test accounts are documented in [the testing guide](../../../tests/TESTING_GUIDE.md).
