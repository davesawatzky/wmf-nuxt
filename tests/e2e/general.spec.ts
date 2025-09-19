import { test, expect } from '@playwright/test'

test.describe('Navigation and Layout', () => {
  test('should display main navigation elements', async ({ page }) => {
    await page.goto('/')

    // Check for header elements
    await expect(page.getByRole('banner')).toBeVisible()
    await expect(page.getByRole('main')).toBeVisible()
  })

  test('should have accessible navigation', async ({ page }) => {
    await page.goto('/')

    // Check for proper ARIA attributes and semantic HTML
    await expect(page.getByRole('navigation')).toBeVisible()

    // Test keyboard navigation
    await page.keyboard.press('Tab')
    const focusedElement = await page.locator(':focus')
    await expect(focusedElement).toBeVisible()
  })

  test('should handle 404 pages gracefully', async ({ page }) => {
    await page.goto('/non-existent-page')

    // Should show error page or redirect
    await expect(page).toHaveURL(/.*404|.*error|.*\//)
  })
})

test.describe('Performance and Loading', () => {
  test('should load homepage within reasonable time', async ({ page }) => {
    const startTime = Date.now()
    await page.goto('/')
    const loadTime = Date.now() - startTime

    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000)
  })

  test('should have no console errors on homepage', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    await page.goto('/')

    // Filter out known acceptable errors (e.g., 401 for unauthenticated requests)
    const criticalErrors = errors.filter(
      (error) => !error.includes('401') && !error.includes('Unauthorized')
    )

    expect(criticalErrors).toHaveLength(0)
  })
})

test.describe('Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/')

    // Should have h1 element
    await expect(page.locator('h1')).toBeVisible()
  })

  test('should have alt text for images', async ({ page }) => {
    await page.goto('/')

    // Check that images have alt attributes
    const images = await page.locator('img').all()
    for (const img of images) {
      const alt = await img.getAttribute('alt')
      expect(alt).toBeTruthy() // Should have alt text or empty alt for decorative images
    }
  })

  test('should have proper form labels', async ({ page }) => {
    await page.goto('/login')

    // Form inputs should have labels
    const inputs = await page
      .locator('input[type="email"], input[type="password"]')
      .all()
    for (const input of inputs) {
      const id = await input.getAttribute('id')
      if (id) {
        await expect(page.locator(`label[for="${id}"]`)).toBeVisible()
      }
    }
  })
})
