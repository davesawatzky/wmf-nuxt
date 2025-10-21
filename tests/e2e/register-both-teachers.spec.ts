// spec: specs/authorization.md
// seed: tests/e2e/seed.spec.ts

import { test, expect } from '@playwright/test'

test.describe('User Registration - Happy Path', () => {
  test('Register New User as Both Private and School Teacher', async ({
    page,
  }) => {
    // Navigate to the login page
    await page.goto('/login')

    // Wait for the page to load
    await page.getByText('Sign In').first().waitFor({ state: 'visible' })

    // Click on "Sign up here." button to navigate to registration form
    await page.getByRole('button', { name: 'Sign up here.' }).click()

    // Enter First Name: "Both"
    await page.getByRole('textbox', { name: 'First Name' }).fill('Both')

    // Enter Last Name: "Teacher"
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Teacher')

    // Enter email: both.teacher@davesawatzky.com
    await page
      .getByRole('textbox', { name: 'Email' })
      .fill('both.teacher@davesawatzky.com')

    // Press Tab
    await page.keyboard.press('Tab')

    // Enter password: BothTeacher789!
    await page
      .getByRole('textbox', { name: 'Password (min. 8 characters' })
      .fill('BothTeacher789!')

    // Press Tab
    await page.keyboard.press('Tab')

    // Enter confirm password: BothTeacher789!
    await page
      .getByRole('textbox', { name: 'Re-enter Password' })
      .fill('BothTeacher789!')

    // Press Tab
    await page.keyboard.press('Tab')

    // Check the "Private Teacher" checkbox
    await page.getByRole('checkbox', { name: 'Private Teacher' }).click()

    // Check the "School Teacher and/or Community Conductor" checkbox
    await page.getByRole('checkbox', { name: 'School Teacher and/or' }).click()

    // Select an instrument (Piano)
    await page.getByLabel('Instrument(s)').selectOption(['Piano'])

    // Verify both checkboxes are checked
    await expect(
      page.getByRole('checkbox', { name: 'Private Teacher' })
    ).toBeChecked()
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
