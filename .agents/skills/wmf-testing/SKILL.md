---
name: wmf-testing
description: "Use when adding, updating, or debugging WMF Nuxt unit, Nuxt component, store, authentication, or Playwright end-to-end tests."
user-invocable: true
---

# WMF Testing

## Test Selection

- Pure utilities use Vitest unit tests under `tests/unit/` with `tests/setup-unit.ts`.
- Components and stores that need Nuxt use tests under `tests/nuxt/` with `tests/setup.ts`.
- Browser workflows use Playwright tests under `tests/e2e/`.
- Use the existing Page Object Model in `tests/pageObjects/`, shared helpers in `tests/helpers/`, and fixtures in `playwright/`.

## Commands

- `pnpm test` runs Vitest.
- `pnpm test:unit` runs the unit project.
- `pnpm test:nuxt` runs the Nuxt project.
- `pnpm test:e2e` runs Chromium E2E tests.
- `pnpm test:e2e:headed` runs Chromium E2E tests with the browser visible.
- `pnpm lint` checks TypeScript and Vue files.

## E2E Dependencies

Authentication and email scenarios require:

- `wmf-nest` on `localhost:3000`
- This app on `localhost:3001`
- MailHog on `localhost:8025` with SMTP on `localhost:1025`

Before running E2E tests, verify these services respond (e.g. `curl localhost:3000`, `curl localhost:3001`, `curl localhost:8025`). If any is unavailable, stop and tell the user which service to start rather than modifying tests to work around connection or timeout errors.

Use worker-scoped auth fixtures for parallel tests. Use `AuthHelper` and `TEST_USERS` rather than duplicating login or MailHog setup.

## Example

Use the existing page objects and test users for an authenticated browser flow:

```ts
import { test } from '@playwright/test'
import { TEST_USERS } from '../../helpers/authHelper'
import { PageManager } from '../../pageObjects/pageManager'

test('regular user can open registrations', async ({ page }) => {
	const pages = new PageManager(page)

	await pages.loginPage.goto()
	await pages.loginPage.signIn(
		TEST_USERS.REGULAR_USER.email,
		TEST_USERS.REGULAR_USER.password,
	)
	await pages.loginPage.verifySuccessfulSignIn('/registrations')
})
```

## Test Quality

1. Prefer role- and label-based locators; use stable test ids when semantic locators are unavailable.
2. Wait for observable UI or network state instead of arbitrary delays.
3. Mock GraphQL for isolated tests and reserve live services for integration and E2E coverage.
4. Clean up any accounts or MailHog emails a test creates in an `afterEach`/`afterAll` hook, unless the test uses the shared `TEST_USERS` accounts, which must never be modified or deleted.
5. Run the single affected test file first. Then always run `pnpm lint`. Run `pnpm test:unit` or `pnpm test:nuxt` if shared helpers, page objects, stores, or setup files changed. Run `pnpm test:e2e` only when auth flows, page objects, or E2E fixtures changed.

See [TESTING_GUIDE.md](../../../tests/TESTING_GUIDE.md) and [the authentication test plan](../../../specs/authentication-test-plan.md) for established workflows.
