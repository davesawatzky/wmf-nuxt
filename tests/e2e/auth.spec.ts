import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', async () => {
  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/form')
    await page.getByText('Clear Errors').click()
    await expect(page).toHaveURL(/.*login/)
  })

  test('should display login form', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByLabel('Email')).toBeVisible({
      timeout: 10000,
    })
    await expect(page.getByLabel('Password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible()
  })

  test('should show validation errors for invalid login', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: 'Sign In' }).click()
    await expect(page.getByText('Email is a required field')).toBeVisible()
    await expect(
      page.getByText('Password must be at least 8 characters')
    ).toBeVisible()
  })

  test('should check for short password', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill('invalid@example.com')
    const passwordInput = page.getByLabel('Password')
    await passwordInput.focus()
    await passwordInput.fill('wrong')
    await passwordInput.blur()
    await page.getByRole('button', { name: 'Sign In' }).click()
    await expect
      .soft(page.getByText('Password is a required field'))
      .toBeVisible()

    await passwordInput.focus()
    await passwordInput.fill('wrong')
    await expect(
      page.getByText('Password must be at least 8 characters')
    ).toBeVisible()
  })

  test('should show error message for password lacking Capital letter', async ({
    page,
  }) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill('invalid@example.com')
    const passwordInput = await page.getByLabel('Password')
    await passwordInput.focus()
    await passwordInput.fill('wrong')
    await passwordInput.blur()
    await page.getByRole('button', { name: 'Sign In' }).click()
    await expect
      .soft(page.getByText('Password is a required field'))
      .toBeVisible()

    await passwordInput.focus()
    await passwordInput.fill('wrongpassword1')
    await expect(
      page.getByText('Password must contain at least 1 uppercase letter')
    ).toBeVisible()
  })

  test('should show error for password lacking number', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill('invalid@example.com')
    const passwordInput = page.getByLabel('Password')
    await passwordInput.focus()
    await passwordInput.fill('wrong')
    await passwordInput.blur()
    await page.getByRole('button', { name: 'Sign In' }).click()
    await expect
      .soft(page.getByText('Password is a required field'))
      .toBeVisible()

    await passwordInput.focus()
    await passwordInput.fill('Wrongpassword')
    await expect(
      page.getByText('Password must contain at least 1 number')
    ).toBeVisible()
  })

  test('should show error for password lacking symbol', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill('invalid@example.com')
    const passwordInput = page.getByLabel('Password')
    await passwordInput.focus()
    await passwordInput.fill('wrong')
    await passwordInput.blur()
    await page.getByRole('button', { name: 'Sign In' }).click()
    await expect
      .soft(page.getByText('Password is a required field'))
      .toBeVisible()

    await passwordInput.focus()
    await passwordInput.fill('Wrongpassword1')
    await expect(
      page.getByText('Password must contain at least 1 symbol')
    ).toBeVisible()
  })

  test('should show error message for incorrect credentials', async ({
    page,
  }) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill('invalid@example.com')
    await page.getByLabel('Password').fill('Wrongpassword1!')
    await page.getByRole('button', { name: 'Sign In' }).click()
    await expect(page.getByText('Incorrect email or password')).toBeVisible({
      timeout: 3000,
    })
  })
})

// Note: Successful login tests would require test user credentials
// and proper backend setup - these would be added in integration environment
