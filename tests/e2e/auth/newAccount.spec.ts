// spec: specs/authentication-test-plan.md
// section: 1. New Account Registration

import { test, expect } from '@playwright/test'
import { PageManager } from '../../pageObjects/pageManager'
import { AuthHelper } from '../../helpers/authHelper'

test.describe('1. New Account Registration', () => {
  let pm: PageManager

  test.beforeEach(async ({ page }) => {
    pm = new PageManager(page)
    // Clear MailHog before each test
    await AuthHelper.clearMailHog()
  })

  test.describe('1.1 Register Regular User Account', () => {
    test('should display all required form fields when clicking sign up', async ({
      page,
    }) => {
      // Navigate to login page
      await pm.loginPage.goto()

      // Click "Sign up here" link
      await pm.loginPage.showSignUpForm()

      // Verify form shows all required fields
      await expect(page.locator('input[name="firstName"]')).toBeVisible()
      await expect(page.locator('input[name="lastName"]')).toBeVisible()
      await expect(page.locator('input[name="email"]')).toBeVisible()
      await expect(page.locator('input[name="password"]')).toBeVisible()
      await expect(page.locator('input[name="password2"]')).toBeVisible()
      await expect(page.locator('input[name="privateTeacher"]')).toBeVisible()
      await expect(page.locator('input[name="schoolTeacher"]')).toBeVisible()
      await expect(
        page.getByRole('button', { name: /register new account/i })
      ).toBeVisible()
    })

    test('should register regular user and send verification email', async ({
      page,
    }) => {
      await pm.loginPage.goto()

      // Click "Sign up here" link
      await pm.loginPage.showSignUpForm()

      // Fill in form
      await pm.loginPage.fillSignUpFormRegularUser(
        'John',
        'Doe',
        `john.doe.${Date.now()}@test.com`,
        'Test123!@#'
      )

      const email = await page.locator('input[name="email"]').inputValue()

      // Click "Register New Account"
      await pm.loginPage.submitRegistration()

      // Verify toast notification appears
      await pm.loginPage.verifySuccessfulRegistration()

      // Verify form returns to sign in view
      await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()

      // Verify email sent to MailHog
      const emailReceived = await AuthHelper.waitForEmailInMailHog(
        email,
        'WMF account verification',
        10000
      )
      expect(emailReceived).toBe(true)
    })
  })

  test.describe('1.2 Register Private Teacher Account', () => {
    test('should show instrument dropdown when private teacher is checked', async ({
      page,
    }) => {
      await pm.loginPage.goto()
      await pm.loginPage.showSignUpForm()

      // Check "Private Teacher" checkbox
      await page.locator('input[name="privateTeacher"]').check()

      // Verify "Instrument(s)" dropdown appears
      await page.waitForTimeout(200)
      await expect(page.locator('select[name="instrument"]')).toBeVisible()
    })

    test('should register private teacher with instrument selection', async ({
      page: _page,
    }) => {
      await pm.loginPage.goto()

      const email = `sarah.smith.${Date.now()}@test.com`

      // Register private teacher
      await pm.loginPage.registerPrivateTeacher(
        'Sarah',
        'Smith',
        email,
        'Teacher456!@#',
        'Piano'
      )

      // Verify success
      await pm.loginPage.verifySuccessfulRegistration()

      // Verify email sent to MailHog
      const emailReceived = await AuthHelper.waitForEmailInMailHog(
        email,
        'WMF account verification',
        10000
      )
      expect(emailReceived).toBe(true)
    })
  })

  test.describe('1.3 Register School Teacher/Community Conductor Account', () => {
    test('should register school teacher without instrument requirement', async ({
      page: _page,
    }) => {
      await pm.loginPage.goto()

      const email = `michael.johnson.${Date.now()}@test.com`

      // Register school teacher
      await pm.loginPage.registerSchoolTeacher(
        'Michael',
        'Johnson',
        email,
        'School789!@#'
      )

      // Verify success
      await pm.loginPage.verifySuccessfulRegistration()

      // Verify email sent to MailHog
      const emailReceived = await AuthHelper.waitForEmailInMailHog(
        email,
        'WMF account verification',
        10000
      )
      expect(emailReceived).toBe(true)
    })
  })

  test.describe('1.4 Register Both Teacher Types', () => {
    test('should register user with both teacher types and require instrument', async ({
      page,
    }) => {
      await pm.loginPage.goto()
      await pm.loginPage.showSignUpForm()

      const email = `both.teacher.${Date.now()}@test.com`

      // Check both teacher checkboxes
      await page.locator('input[name="privateTeacher"]').check()
      await page.locator('input[name="schoolTeacher"]').check()
      await page.waitForTimeout(200)

      // Verify instrument dropdown appears
      await expect(page.locator('select[name="instrument"]')).toBeVisible()

      // Fill form
      await pm.loginPage.fillSignUpFormBothTeachers(
        'Emma',
        'Williams',
        email,
        'Both000!@#',
        'Violin'
      )

      // Submit
      await pm.loginPage.submitRegistration()

      // Verify success
      await pm.loginPage.verifySuccessfulRegistration()

      // Verify email sent
      const emailReceived = await AuthHelper.waitForEmailInMailHog(
        email,
        'WMF account verification',
        10000
      )
      expect(emailReceived).toBe(true)
    })
  })
})
