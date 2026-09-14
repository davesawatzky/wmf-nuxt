# Playwright E2E Testing Examples

## Account Management Test

```typescript
import { test, expect } from '@playwright/test'
import { setup, createPage } from '@nuxt/test-utils/e2e'

await setup({ host: 'http://localhost:3000', browser: true })

test('should create a new account', async () => {
  const page = await createPage('/accounts/create')
  
  await page.getByLabel('Email Address').fill('new@example.com')
  await page.getByLabel('Year Started').fill('2024')
  await page.getByRole('button', { name: 'Save Account' }).click()
  
  await expect(page).toHaveURL(/\/accounts/)
  await expect(page.getByText('Account created successfully')).toBeVisible()
})
```

## Form Validation Test

```typescript
test('should handle validation errors', async () => {
  const page = await createPage('/accounts/create')
  
  await page.getByRole('button', { name: 'Save Account' }).click()
  
  await expect(page.getByText('Email is required')).toBeVisible()
  await expect(page.getByText('Year started is required')).toBeVisible()
})
```

## PrimeVue DataTable Test

```typescript
test('should interact with DataTable', async () => {
  const page = await createPage('/accounts')
  
  await expect(page.locator('[data-pc-section="table"]')).toBeVisible()
  
  // Test global filter
  await page.getByPlaceholder('Search accounts').fill('test@example.com')
  await expect(page.getByRole('row')).toHaveCount(2)
  
  // Test sorting
  await page.getByRole('columnheader', { name: 'Email' }).click()
})
```

## API Mocking Test

```typescript
test('should mock API responses', async () => {
  const page = await createPage()
  
  await page.route('/api/accounts', async route => {
    await route.fulfill({
      json: [
        { id: 1, email: 'mock@example.com', year_started: 2020 },
      ]
    })
  })

  await page.goto('/accounts')
  await expect(page.getByText('mock@example.com')).toBeVisible()
})
```
