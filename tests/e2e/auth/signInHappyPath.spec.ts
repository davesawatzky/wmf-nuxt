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
      page: _page,
    }) => {
      // Skip if test users don't exist in database
      test.skip(
        !process.env.TEST_USERS_EXIST,
        'Requires test users in database'
      )

      await pm.loginPage.goto()

      // Enter credentials
      await pm.loginPage.signIn(
        TEST_USERS.REGULAR_USER.email,
        TEST_USERS.REGULAR_USER.password
      )

      // Verify successful sign in
      await pm.loginPage.verifySuccessfulSignIn('/registrations')

      // Verify on registrations page
      await pm.registrationsPage.verifyOnRegistrationsPage()
    })
  })

  test.describe('3.2 Sign In Private Teacher (Verified but Inactive)', () => {
    test('should sign in and redirect to user information page', async ({
      page: _page,
    }) => {
      // Skip if test users don't exist in database
      test.skip(
        !process.env.TEST_USERS_EXIST,
        'Requires test users in database'
      )

      await pm.loginPage.goto()

      // Sign in with private teacher credentials
      await pm.loginPage.signIn(
        TEST_USERS.PRIVATE_TEACHER.email,
        TEST_USERS.PRIVATE_TEACHER.password
      )

      // Verify redirect to user information page (not registrations)
      await pm.loginPage.verifySuccessfulSignIn('/userinformation')
    })
  })

  test.describe('3.3 Sign In Admin Account', () => {
    test('should sign in admin and redirect to admin dashboard', async ({
      page: _page,
    }) => {
      // Skip if test users don't exist in database
      test.skip(
        !process.env.TEST_USERS_EXIST,
        'Requires test users in database'
      )

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
