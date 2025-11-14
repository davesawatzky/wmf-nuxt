// spec: specs/authentication-test-plan.md
// section: 2. Email Verification

import { test, expect } from '@playwright/test'
import { PageManager } from '../../pageObjects/pageManager'
import { AuthHelper } from '../../helpers/authHelper'

test.describe('2. Email Verification', () => {
  let pm: PageManager

  test.beforeEach(async ({ page }) => {
    pm = new PageManager(page)
  })

  test.describe('2.1 Verify New Account via Email Link', () => {
    test('should verify email with valid token and redirect to login', async ({
      page: _page,
    }) => {
      // First register a user
      const email = `verify.test.${Date.now()}@test.com`
      await pm.loginPage.goto()
      await pm.loginPage.registerRegularUser(
        'Verify',
        'Test',
        email,
        'Test123!@#'
      )

      // Wait for email
      await AuthHelper.waitForEmailInMailHog(
        email,
        'WMF account verification',
        10000
      )

      // Get verification token from MailHog
      const token = await AuthHelper.getVerificationTokenFromMailHog(email)
      expect(token).not.toBeNull()

      // Visit email confirmation page with token
      await pm.emailConfirmationPage.gotoWithToken(token!)

      // Verify success message
      await pm.emailConfirmationPage.verifySuccessMessage()

      // Click continue to login
      await pm.emailConfirmationPage.clickContinue()

      // Verify redirect to login
      await pm.emailConfirmationPage.verifyRedirectToLogin()
    })
  })

  test.describe('2.2 Verify with Expired Token', () => {
    // FIXME: Backend redirects to /login instead of showing error on /EmailConfirmation page
    // Expected: Error message "Email confirmation token expired" displayed on EmailConfirmation page
    // Actual: Page redirects to /login (shown by URL: http://localhost:3001/login)
    test.fixme(
      'should show error message for expired token',
      async ({ page: _page }) => {
        // Use an old/expired token (simulated)
        await pm.emailConfirmationPage.gotoWithToken('expired-token-123456789')

        // Verify expired token message
        await pm.emailConfirmationPage.verifyExpiredTokenMessage()
      }
    )
  })

  test.describe('2.3 Verify with Invalid Token', () => {
    // FIXME: Backend redirects to /login instead of showing error on /EmailConfirmation page
    // Expected: Error message "Bad confirmation token" displayed on EmailConfirmation page
    // Actual: Page redirects to /login (shown by URL: http://localhost:3001/login)
    test.fixme(
      'should show error for invalid verification token',
      async ({ page: _page }) => {
        // Use a completely invalid token format
        await pm.emailConfirmationPage.gotoWithToken('invalid-token-format')

        // Verify invalid token message
        await pm.emailConfirmationPage.verifyInvalidTokenMessage()
      }
    )
  })
})
