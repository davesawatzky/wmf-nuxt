---
name: testing-patterns
description: Provides unit, component, E2E, and store testing patterns using Vitest, Playwright, and Nuxt Test Utils. Use when writing tests for components, stores, or end-to-end workflows.
---

# Testing Patterns

## Unit Testing with Vitest

```typescript
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import AccountCard from '~/components/accounts/AccountCard.vue'

describe('AccountCard', () => {
  it('renders account information', async () => {
    const account = { id: 1, email: 'test@example.com', year_started: 2020 }
    const component = await mountSuspended(AccountCard, { props: { account } })
    
    expect(component.text()).toContain('test@example.com')
    expect(component.text()).toContain('2020')
  })
})
```

## Store Testing with Pinia

```typescript
import { setActivePinia, createPinia } from 'pinia'
import { useAccountsStore } from '~/stores/accountsStore'

describe('AccountsStore', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('should select an account', () => {
    const store = useAccountsStore()
    const mockAccount = { id: 1, email: 'test@example.com' }
    
    store.selectAccount(mockAccount)
    expect(store.selectedAccount).toEqual(mockAccount)
  })
})
```

## E2E Testing with Playwright

See [playwright-examples.md](playwright-examples.md) for comprehensive E2E patterns.

## Playwright Configuration

```typescript
// apps/admin/playwright.config.ts
export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```
