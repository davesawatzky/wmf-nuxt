// spec: specs/authentication-test-plan.md
// section: 8. Resend Verification/Reset Emails

import { test, expect } from '@playwright/test'
import { PageManager } from '../../pageObjects/pageManager'
import { AuthHelper } from '../../helpers/authHelper'

test.describe('8. Resend Verification/Reset Emails', () => {
  let pm: PageManager

  test.beforeEach(async ({ page }) => {
    pm = new PageManager(page)
    await AuthHelper.clearMailHog()
  })

  test.describe('8.1 Resend Verification Email from Dialog', () => {
    test('should resend verification email when requested from dialog', async ({
      page: _page,
    }) => {
      // First register a user (but don't verify)
      const email = `resend.test.${Date.now()}@test.com`
      await pm.loginPage.goto()
      await pm.loginPage.registerRegularUser(
        'Resend',
        'Test',
        email,
        'Test123!@#'
      )

      // Clear the first verification email
      await AuthHelper.clearMailHog()

      // Try to sign in without verifying
      await pm.loginPage.signIn(email, 'Test123!@#')

      // Dialog should appear
      await pm.loginPage.verifyUnverifiedAccountDialog()

      // Click "Re-Send Verification"
      await pm.loginPage.clickResendVerification()

      // Verify new email sent
      const emailReceived = await AuthHelper.waitForEmailInMailHog(
        email,
        'WMF account verification',
        10000
      )
      expect(emailReceived).toBe(true)
    })
  })

  test.describe('8.2 Resend Password Reset Email from Dialog', () => {
    test('should resend password reset email when requested from dialog', async ({
      page: _page,
    }) => {
      // This test requires a user with pending password reset
      // Skipped for now - requires specific test data setup
      test.skip()

      await pm.loginPage.goto()

      // Try to sign in with account that has pending reset
      await pm.loginPage.signIn('reset.pending@test.com', 'OldPassword123!')

      // Dialog should appear
      await pm.loginPage.verifyPasswordResetDialog()

      // Click "Re-Send Password Change Email"
      await pm.loginPage.clickResendPasswordReset()

      // Verify new email sent
      const emailReceived = await AuthHelper.waitForEmailInMailHog(
        'reset.pending@test.com',
        'WMF password reset',
        10000
      )
      expect(emailReceived).toBe(true)
    })
  })
})
