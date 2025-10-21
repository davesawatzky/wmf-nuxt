// spec: specs/authorization.md
// seed: tests/e2e/seed.spec.ts

import { test, expect } from '@playwright/test'

test.describe('User Registration - Happy Path', () => {
  test('Register New User as Private Teacher', async ({ page }) => {
    // Navigate to the login page
    await page.goto('/login')

    // Wait for the page to load
    await page.getByText('Sign In').first().waitFor({ state: 'visible' })

    // Click on the Sign up here button to navigate to registration form
    await page.getByRole('button', { name: 'Sign up here.' }).click()

    // Verify the sign-up form displays with required fields
    await expect(page.getByRole('heading', { name: 'Sign up' })).toBeVisible()

    // Verify Private Teacher checkbox is visible
    await expect(
      page.getByRole('checkbox', { name: 'Private Teacher' })
    ).toBeVisible()

    // Verify School Teacher checkbox is visible
    await expect(
      page.getByRole('checkbox', {
        name: 'School Teacher and/or Community Conductor',
      })
    ).toBeVisible()

    // Click in the email input field
    await page.getByRole('textbox', { name: 'Email' }).click()

    // Type a valid email address: teacher.test@davesawatzky.com
    await page
      .getByRole('textbox', { name: 'Email' })
      .fill('teacher.test@davesawatzky.com')

    // Press Tab to trigger validation
    await page.keyboard.press('Tab')

    // Type a valid password: ValidPass123!
    await page
      .getByRole('textbox', { name: 'Password (min. 8 characters' })
      .fill('ValidPass123!')

    // Press Tab to trigger validation
    await page.keyboard.press('Tab')

    // Type the same password: ValidPass123!
    await page
      .getByRole('textbox', { name: 'Re-enter Password' })
      .fill('ValidPass123!')

    // Press Tab to trigger validation
    await page.keyboard.press('Tab')

    // Click in the First Name input field
    await page.getByRole('textbox', { name: 'First Name' }).click()

    // Type first name: Teacher
    await page.getByRole('textbox', { name: 'First Name' }).fill('Teacher')

    // Click in the Last Name input field
    await page.getByRole('textbox', { name: 'Last Name' }).click()

    // Type last name: Test
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Test')

    // Check the "Private Teacher" checkbox
    await page.getByRole('checkbox', { name: 'Private Teacher' }).click()

    // Verify checkbox is checked
    await expect(
      page.getByRole('checkbox', { name: 'Private Teacher' })
    ).toBeChecked()

    // Select Piano as the instrument
    await page.getByLabel('Instrument(s)').selectOption(['Piano'])

    // Click "Register New Account" button
    await page.getByRole('button', { name: 'Register New Account' }).click()

    // Wait for form submission and expect either success message or error
    // Note: Email sending may fail in test environment
    await expect(
      page
        .getByText('Check Email for account verification link')
        .or(page.getByText('Failed to send verification email'))
    ).toBeVisible({ timeout: 10000 })
  })
})
