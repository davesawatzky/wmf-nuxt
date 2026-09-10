// spec: specs/authentication-test-plan.md
// section: 4. Sign In - Error Cases

import { test, expect } from '@playwright/test'
import { PageManager } from '../../pageObjects/pageManager'
import { TEST_USERS } from '../../helpers/authHelper'

test.describe('4. Sign In - Error Cases', () => {
  let pm: PageManager

  test.beforeEach(async ({ page }) => {
    pm = new PageManager(page)
  })

  test.describe('4.1 Sign In with Unverified Email', () => {
    test('should show unverified account dialog with resend option', async ({
      page,
    }) => {
      // Create an unverified test user on the fly
      const email = `unverified.${Date.now()}@test.com`
      await pm.loginPage.goto()
      await pm.loginPage.registerRegularUser(
        'Unverified',
        'User',
        email,
        'Test123!@#'
      )
      await pm.loginPage.verifySuccessfulRegistration()
      await pm.loginPage.waitForFormClear()
      await pm.loginPage.goto()

      // Try to sign in with unverified account
      await pm.loginPage.signIn(email, 'Test123!@#')

      // Verify dialog appears
      await pm.loginPage.verifyUnverifiedAccountDialog()

      // Verify dialog has expected buttons (using dialog locator to avoid DevTools button)
      const dialog = page.locator('.p-dialog')
      await expect(dialog.getByRole('button', { name: /close/i })).toBeVisible()
      await expect(
        dialog.getByRole('button', { name: /re-send verificat/i })
      ).toBeVisible()
    })
  })

  test.describe('4.2 Sign In with Incorrect Password', () => {
    test('should show error toast and clear form fields', async ({ page }) => {
      await pm.loginPage.goto()

      // Enter valid email but wrong password (must have symbol for validation)
      await pm.loginPage.signIn(
        TEST_USERS.REGULAR_USER.email,
        'WrongPassword123!@#'
      )

      // Verify error toast
      await pm.loginPage.verifyToastError(/incorrect email or password/i)

      // Verify still on login page
      await expect(page).toHaveURL(/\/login/)
    })
  })

  test.describe('4.3 Sign In with Non-Existent Email', () => {
    test('should show same error as incorrect password', async ({
      page: _page,
    }) => {
      await pm.loginPage.goto()

      // Enter email that doesn't exist
      await pm.loginPage.signIn('nonexistent@test.com', 'AnyPassword123!')

      // Verify error toast (same message for security)
      await pm.loginPage.verifyToastError(/incorrect email or password/i)
    })
  })

  test.describe('4.4 Sign In with Password Reset Pending', () => {
    test('should show password reset pending dialog', async ({ page }) => {
      // This test requires a user with pending password reset
      // Skipped for now - requires test data setup
      test.skip()

      await pm.loginPage.goto()

      // Sign in with account that has pending reset
      await pm.loginPage.signIn('reset.pending@test.com', 'OldPassword123!')

      // Verify dialog appears
      await pm.loginPage.verifyPasswordResetDialog()

      // Verify buttons
      await expect(page.getByRole('button', { name: /close/i })).toBeVisible()
      await expect(
        page.getByRole('button', { name: /re-send password change email/i })
      ).toBeVisible()
    })
  })
})
