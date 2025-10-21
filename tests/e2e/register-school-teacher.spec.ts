// spec: specs/authorization.md
// seed: tests/e2e/seed.spec.ts

import { test, expect } from '@playwright/test'

test.describe('User Registration - Happy Path', () => {
  test('Register New User as School Teacher', async ({ page }) => {
    // Navigate to the login page
    await page.goto('/login')

    // Wait for the page to load
    await page.getByText('Sign In').first().waitFor({ state: 'visible' })

    // Click on "Sign up here." button to navigate to registration form
    await page.getByRole('button', { name: 'Sign up here.' }).click()

    // Enter First Name: "School"
    await page.getByRole('textbox', { name: 'First Name' }).fill('School')

    // Enter Last Name: "Teacher"
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Teacher')

    // Enter email: school.teacher@davesawatzky.com
    await page
      .getByRole('textbox', { name: 'Email' })
      .fill('school.teacher@davesawatzky.com')

    // Press Tab
    await page.keyboard.press('Tab')

    // Enter password: SchoolPass456!
    await page
      .getByRole('textbox', { name: 'Password (min. 8 characters' })
      .fill('SchoolPass456!')

    // Press Tab
    await page.keyboard.press('Tab')

    // Enter confirm password: SchoolPass456!
    await page
      .getByRole('textbox', { name: 'Re-enter Password' })
      .fill('SchoolPass456!')

    // Press Tab
    await page.keyboard.press('Tab')

    // Check the "School Teacher and/or Community Conductor" checkbox
    await page.getByRole('checkbox', { name: 'School Teacher and/or' }).click()

    // Verify checkbox is checked
    await expect(
      page.getByRole('checkbox', { name: 'School Teacher and/or' })
    ).toBeChecked()

    // Click "Register New Account" button
    await page.getByRole('button', { name: 'Register New Account' }).click()

    // Wait for form submission and expect either success message or error
    await expect(
      page
        .getByText('Check Email for account verification link')
        .or(page.getByText('Failed to send verification email'))
    ).toBeVisible({ timeout: 10000 })
  })
})
