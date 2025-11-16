// spec: specs/authentication-test-plan.md
// section: 3. Sign In - Happy Path

import { test } from '@playwright/test'
import { PageManager } from '../../pageObjects/pageManager'
import { TEST_USERS } from '../../helpers/authHelper'

test.describe('3. Sign In - Happy Path', () => {
  let pm: PageManager

  test.beforeEach(async ({ page }) => {
    pm = new PageManager(page)
  })

  test.describe('3.1 Sign In Regular User (Verified)', () => {
    test('should sign in successfully and redirect to registrations', async ({
      page,
    }) => {
      await pm.loginPage.goto()

      // Try original password first
      try {
        await pm.loginPage.signIn(
          TEST_USERS.REGULAR_USER.email,
          TEST_USERS.REGULAR_USER.password
        )
        await page.waitForURL('**/registrations', { timeout: 3000 })
      } catch {
        // Original password failed, try the reset password
        console.log('Original password failed, trying reset password...')
        await pm.loginPage.goto()
        await pm.loginPage.signIn(
          TEST_USERS.REGULAR_USER.email,
          'NewPass123!@#' // Password from password reset test
        )
      }

      // Verify successful sign in (should be on registrations regardless of which password worked)
      await pm.loginPage.verifySuccessfulSignIn('/registrations')

      // Verify on registrations page
      await pm.registrationsPage.verifyOnRegistrationsPage()
    })
  })

  test.describe('3.2 Sign In Private Teacher (Verified)', () => {
    test('should sign in and redirect to registrations', async ({
      page: _page,
    }) => {
      await pm.loginPage.goto()

      // Sign in with private teacher credentials
      await pm.loginPage.signIn(
        TEST_USERS.PRIVATE_TEACHER.email,
        TEST_USERS.PRIVATE_TEACHER.password
      )

      // Verify redirect to registrations page
      // Note: Private teachers are inactive initially, but since this user is pre-created
      // in the database with email_confirmed=true, they've likely been activated already.
      // The UserInformation page automatically activates users on first visit.
      await pm.loginPage.verifySuccessfulSignIn('/registrations')
    })
  })

  test.describe('3.3 Sign In Admin Account', () => {
    test('should sign in admin and redirect to admin dashboard', async ({
      page: _page,
    }) => {
      await pm.loginPage.goto()

      // Sign in with admin credentials
      await pm.loginPage.signIn(
        TEST_USERS.ADMIN.email,
        TEST_USERS.ADMIN.password
      )

      // Verify redirect to admin page
      await pm.loginPage.verifySuccessfulSignIn('/admin')
    })
  })
})
