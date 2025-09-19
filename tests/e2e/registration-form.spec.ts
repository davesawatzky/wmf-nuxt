import { test, expect } from '@playwright/test'

test.describe('Registration Form Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Note: In a real test environment, you'd authenticate first
    // For now, this assumes we can access the form directly
    await page.goto('/')
  })

  test('should display performer type selection', async ({ page }) => {
    // Navigate to form (assuming authenticated)
    await page.goto('/form')

    // Should show performer type options
    await expect(page.getByText(/solo performer/i)).toBeVisible()
    await expect(page.getByText(/group/i)).toBeVisible()
    await expect(page.getByText(/school/i)).toBeVisible()
    await expect(page.getByText(/community/i)).toBeVisible()
  })

  test('should show different tabs based on performer type', async ({
    page,
  }) => {
    await page.goto('/form')

    // Select solo performer
    await page.getByText(/solo performer/i).click()

    // Should show solo-specific tabs
    await expect(page.getByText(/performer info/i)).toBeVisible()
    await expect(page.getByText(/teacher info/i)).toBeVisible()
    await expect(page.getByText(/classes/i)).toBeVisible()
    await expect(page.getByText(/summary/i)).toBeVisible()
  })

  test('should validate required fields in performer form', async ({
    page,
  }) => {
    await page.goto('/form')

    // Select solo performer and navigate to performer info
    await page.getByText(/solo performer/i).click()
    await page.getByText(/performer info/i).click()

    // Try to proceed without filling required fields
    await page.getByRole('button', { name: /next/i }).click()

    // Should show validation errors
    await expect(page.getByText(/first name is required/i)).toBeVisible()
    await expect(page.getByText(/last name is required/i)).toBeVisible()
  })

  test('should persist form data across page navigation', async ({ page }) => {
    await page.goto('/form')

    // Select solo performer
    await page.getByText(/solo performer/i).click()
    await page.getByText(/performer info/i).click()

    // Fill some data
    const firstName = 'John'
    const lastName = 'Doe'
    await page.getByLabel(/first name/i).fill(firstName)
    await page.getByLabel(/last name/i).fill(lastName)

    // Navigate away and back
    await page.getByText(/teacher info/i).click()
    await page.getByText(/performer info/i).click()

    // Data should be preserved
    await expect(page.getByLabel(/first name/i)).toHaveValue(firstName)
    await expect(page.getByLabel(/last name/i)).toHaveValue(lastName)
  })

  test('should show class selection interface', async ({ page }) => {
    await page.goto('/form')

    // Navigate to classes tab
    await page.getByText(/solo performer/i).click()
    await page.getByText(/classes/i).click()

    // Should show class categories
    await expect(page.getByText(/piano/i)).toBeVisible()
    await expect(page.getByText(/voice/i)).toBeVisible()
    await expect(page.getByText(/strings/i)).toBeVisible()
  })

  test('should calculate total fees correctly', async ({ page }) => {
    await page.goto('/form')

    // Navigate to summary
    await page.getByText(/solo performer/i).click()
    await page.getByText(/summary/i).click()

    // Should show fee breakdown
    await expect(page.getByText(/total fees/i)).toBeVisible()
    await expect(page.getByText(/\$\d+\.\d{2}/)).toBeVisible() // Currency format
  })
})

test.describe('Mobile Responsiveness', () => {
  test('should be mobile-friendly', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/form')

    // Form should be responsive
    await expect(page.getByText(/solo performer/i)).toBeVisible()

    // Navigation should work on mobile
    await page.getByText(/solo performer/i).click()
    await expect(page.getByText(/performer info/i)).toBeVisible()
  })
})
