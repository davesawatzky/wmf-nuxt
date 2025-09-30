import { test } from '@playwright/test'
import { PageManager } from '../pageObjects/pageManager'

test.describe('Authentication Flow', async () => {
  test('should redirect to login when not authenticated', async ({ page }) => {
    const pm = new PageManager(page)
    await pm.onAuthPage().shouldRedirectToLoginWhenNotAuthenticated()
  })

  test('should display login form', async ({ page }) => {
    const pm = new PageManager(page)
    await pm.onAuthPage().shouldDisplayLoginForm()
  })

  test('should show validation errors for invalid login', async ({ page }) => {
    const pm = new PageManager(page)
    await pm.onAuthPage().shouldShowValidationErrorsForInvalidLogin()
  })

  test('should check for short password', async ({ page }) => {
    const pm = new PageManager(page)
    await pm
      .onAuthPage()
      .shouldCheckForShortPassword('invalid@email.com', 'wrong', 'short')
  })

  test('should show error message for password lacking Capital letter', async ({
    page,
  }) => {
    const pm = new PageManager(page)
    await pm
      .onAuthPage()
      .shouldShowErrorMessageForPasswordLackingCapitalLetter(
        'invalid@email.com',
        'wrong',
        'nouppercase1'
      )
  })

  test('should show error for password lacking number', async ({ page }) => {
    const pm = new PageManager(page)
    await pm
      .onAuthPage()
      .shouldShowErrorForPasswordLackingNumber(
        'invalid@email.com',
        'wrong',
        'NoNumberHere!'
      )
  })

  test('should show error for password lacking symbol', async ({ page }) => {
    const pm = new PageManager(page)
    await pm
      .onAuthPage()
      .shouldShowErrorForPasswordLackingSymbol(
        'invalid@email.com',
        'wrong',
        'NoSymbol1'
      )
  })

  test('should show error message for incorrect credentials', async ({
    page,
  }) => {
    const pm = new PageManager(page)
    await pm
      .onAuthPage()
      .shouldShowErrorMessageForIncorrectCredentials(
        'invalid@email.com',
        'Wrongpassword1!'
      )
  })

  test('should load registration page after login', async ({ page }) => {
    const pm = new PageManager(page)
    await pm
      .onAuthPage()
      .shouldLoadRegistrationPageAfterLogin(
        'info@davesawatzky.com',
        'David123!'
      )
  })
  test('Sign Up Private Teacher', async ({ page }) => {
    const pm = new PageManager(page)
    await pm
      .onAuthPage()
      .signUpPrivateTeacher('Johnny', 'Bravo', 'john@bravo.com', 'Bravo123!')
  })
})
