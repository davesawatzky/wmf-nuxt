// spec: specs/authentication-test-plan.md
// section: 5. Form Validation

import { test, expect } from '@playwright/test'
import { PageManager } from '../../pageObjects/pageManager'

test.describe('5. Form Validation', () => {
  let pm: PageManager

  test.beforeEach(async ({ page }) => {
    pm = new PageManager(page)
  })

  test.describe('5.1 Sign Up - Empty Fields', () => {
    test('should show validation errors for all required fields', async ({
      page,
    }) => {
      await pm.loginPage.goto()
      await pm.loginPage.showSignUpForm()

      // Click submit without filling fields
      await pm.loginPage.submitRegistration()

      // Wait for validation
      await page.waitForTimeout(500)

      // Verify validation errors appear (based on actual error messages)
      await expect(
        page.locator('text=/email is a required field/i')
      ).toBeVisible()
      await expect(
        page.locator('text=/password must be at least 8 characters/i')
      ).toBeVisible()
      await expect(
        page.locator('text=/password 2 must be at least 8 characters/i')
      ).toBeVisible()
    })
  })

  test.describe('5.2 Sign Up - Invalid Email Format', () => {
    test('should show email format validation error', async ({ page }) => {
      await pm.loginPage.goto()
      await pm.loginPage.showSignUpForm()

      // Enter invalid email
      await page.locator('input[name="email"]').fill('notanemail')
      await page.locator('input[name="email"]').blur()

      // Verify error
      await pm.loginPage.verifyEmailFormatError()
    })
  })

  test.describe('5.3 Sign Up - Weak Password', () => {
    test('should show error for password too short', async ({ page }) => {
      await pm.loginPage.goto()
      await pm.loginPage.showSignUpForm()

      await page.locator('input[name="password"]').fill('Test1!')
      await page.locator('input[name="password"]').blur()

      await pm.loginPage.verifyPasswordError(/at least 8 characters/i)
    })

    test('should show error for password missing number', async ({ page }) => {
      await pm.loginPage.goto()
      await pm.loginPage.showSignUpForm()

      await page.locator('input[name="password"]').fill('TestPass!@#')
      await page.locator('input[name="password"]').blur()

      await pm.loginPage.verifyPasswordError(/contain at least 1 number/i)
    })

    test('should show error for password missing uppercase', async ({
      page,
    }) => {
      await pm.loginPage.goto()
      await pm.loginPage.showSignUpForm()

      await page.locator('input[name="password"]').fill('testpass123!')
      await page.locator('input[name="password"]').blur()

      await pm.loginPage.verifyPasswordError(/contain at least 1 uppercase/i)
    })

    test('should show error for password missing special character', async ({
      page,
    }) => {
      await pm.loginPage.goto()
      await pm.loginPage.showSignUpForm()

      await page.locator('input[name="password"]').fill('TestPass123')
      await page.locator('input[name="password"]').blur()

      await pm.loginPage.verifyPasswordError(/contain at least 1 symbol/i)
    })
  })

  test.describe('5.4 Sign Up - Password Mismatch', () => {
    test('should show error when passwords do not match', async ({ page }) => {
      await pm.loginPage.goto()
      await pm.loginPage.showSignUpForm()

      // Enter different passwords
      await page.locator('input[name="password"]').fill('Test123!@#')
      await page.locator('input[name="password2"]').fill('Different456!@#')
      await page.locator('input[name="password2"]').blur()

      // Verify mismatch error
      await pm.loginPage.verifyPasswordMismatchError()
    })
  })

  test.describe('5.5 Sign Up - Private Teacher Without Instrument', () => {
    test('should require instrument selection for private teacher', async ({
      page,
    }) => {
      await pm.loginPage.goto()
      await pm.loginPage.showSignUpForm()

      // Check private teacher
      await page.locator('input[name="privateTeacher"]').check()
      await page.waitForTimeout(200)

      // Fill all fields except instrument
      await page.locator('input[name="firstName"]').fill('Test')
      await page.locator('input[name="lastName"]').fill('Teacher')
      await page.locator('input[name="email"]').fill('test@test.com')
      await page.locator('input[name="password"]').fill('Test123!@#')
      await page.locator('input[name="password2"]').fill('Test123!@#')

      // Try to submit
      await pm.loginPage.submitRegistration()
      await page.waitForTimeout(500)

      // Verify instrument validation error
      await expect(page.locator('text=/select an instrument/i')).toBeVisible()
    })
  })

  test.describe('5.6 Sign In - Empty Fields', () => {
    test('should show validation errors for empty email and password', async ({
      page,
    }) => {
      await pm.loginPage.goto()

      // Click sign in without entering credentials
      await pm.loginPage.submitSignIn()
      await page.waitForTimeout(500)

      // Verify validation errors (based on actual error messages)
      await expect(
        page.locator('text=/email is a required field/i')
      ).toBeVisible()
      await expect(
        page.locator('text=/password must be at least 8 characters/i')
      ).toBeVisible()
    })
  })
})
