import { test, expect } from '@playwright/test'
import { PageManager } from '../pageObjects/pageManager'

test.describe('User Login - Happy Path', () => {
  let pageManager: PageManager

  test.beforeEach(async ({ page, context }) => {
    // Clear storage state to ensure clean slate for login tests
    await context.clearCookies()
    pageManager = new PageManager(page)
  })

  test('3.1 Successful Login with Existing User', async ({ page }) => {
    const authPage = pageManager.getAuthPage()

    // Navigate to login page
    await authPage.navigateToLogin()
    await page.waitForLoadState('domcontentloaded')

    // Wait for form to be visible
    await expect.soft(authPage.signInButton).toBeVisible()

    // Verify login form displays
    const formState = await authPage.isLoginFormVisible()
    expect.soft(formState.email).toBeTruthy()
    expect.soft(formState.password).toBeTruthy()
    expect.soft(formState.signInButton).toBeTruthy()
    expect.soft(formState.signUpLink).toBeTruthy()

    // Enter valid credentials
    await authPage.fillEmail('existing.user@davesawatzky.com')
    await authPage.blurEmail()
    await authPage.fillPassword('ExistingPass123!')
    await authPage.blurPassword()

    // Click Sign In
    await authPage.clickSignIn()

    // Wait for authentication and redirect
    await page.waitForURL(/.*registrations/)

    // Verify successful redirect
    expect.soft(page.url()).toContain('/registrations')

    // Logout for cleanup
    await authPage.logout()
    await page.waitForURL('/login')
  })

  test('3.2 Login and Navigate to Protected Route', async ({ page }) => {
    const authPage = pageManager.getAuthPage()

    // Navigate directly to protected route
    await authPage.navigateToProtectedRoute('/Form')

    // Verify redirect to login with redirect parameter
    await page.waitForURL(/.*login/)
    const url = await authPage.getCurrentUrl()
    expect.soft(url).toContain('/login')

    // Enter valid credentials
    await authPage.login('existing.user@davesawatzky.com', 'ExistingPass123!')

    // Wait for redirect back to protected route
    await page.waitForURL(/.*registrations/)
    expect.soft(page.url()).toContain('/registrations')

    // Cleanup
    await authPage.logout()
  })

  test('3.1b Login with Enter Key', async ({ page }) => {
    const authPage = pageManager.getAuthPage()

    await authPage.navigateToLogin()

    // Login using Enter key instead of clicking button
    await authPage.loginWithEnter(
      'existing.user@davesawatzky.com',
      'ExistingPass123!'
    )

    await page.waitForURL(/.*registrations/)
    expect.soft(page.url()).toContain('/registrations')

    await authPage.logout()
  })
})

test.describe('User Login - Validation & Error Testing', () => {
  let pageManager: PageManager

  test.beforeEach(async ({ page, context }) => {
    // Clear storage state to ensure clean slate
    await context.clearCookies()
    pageManager = new PageManager(page)
  })

  test('4.1 Invalid Credentials', async ({ page }) => {
    const authPage = pageManager.getAuthPage()

    await authPage.navigateToLogin()

    // Enter non-existent credentials
    await authPage.login('nonexistent@davesawatzky.com', 'WrongPassword123!')

    // Wait for error message to appear
    await page.waitForSelector('text=Incorrect email or password')

    const errorState = await authPage.getValidationErrorText(
      'Incorrect email or password'
    )
    expect.soft(errorState.isVisible).toBeTruthy()

    // Verify user remains on login page
    const url = await authPage.getCurrentUrl()
    expect.soft(url).toContain('/login')
  })

  test('4.2 Empty Form Submission', async ({ page }) => {
    const authPage = pageManager.getAuthPage()

    await authPage.navigateToLogin()

    // Click Sign In without filling fields
    await authPage.clickSignIn()

    // Wait for validation errors to appear
    await page.waitForSelector('text=Email is a required field')

    // Check for email validation error
    const emailError = await authPage.getValidationErrorText(
      'Email is a required field'
    )
    expect.soft(emailError.isVisible).toBeTruthy()

    // Check for password validation error
    const passwordError = await authPage.getValidationErrorText(
      'Password must be at least 8 characters'
    )
    expect.soft(passwordError.isVisible).toBeTruthy()

    // Verify form submission was prevented (still on login page)
    const url = await authPage.getCurrentUrl()
    expect.soft(url).toContain('/login')
  })

  test('4.3 Invalid Email Format on Login', async ({ page }) => {
    const authPage = pageManager.getAuthPage()

    await authPage.navigateToLogin()

    // Enter invalid email format
    await authPage.fillEmail('not-an-email')
    await authPage.blurEmail()

    // Wait for validation error to appear
    await page.waitForSelector('text=Email must be a valid email')

    // Verify error message
    const errorState = await authPage.getValidationErrorText(
      'Email must be a valid email'
    )
    expect.soft(errorState.isVisible).toBeTruthy()
  })

  test('4.4 Short Password Validation', async ({ page }) => {
    const authPage = pageManager.getAuthPage()

    await authPage.navigateToLogin()

    // Enter valid email
    await authPage.fillEmail('test@davesawatzky.com')
    await authPage.blurEmail()

    // Enter short password
    await authPage.fillPassword('short')
    await authPage.blurPassword()

    // Trigger validation
    await authPage.clickSignIn()
    await page.waitForSelector('text=Password must be at least 8 characters')

    // Verify error message
    const errorState = await authPage.getValidationErrorText(
      'Password must be at least 8 characters'
    )
    expect.soft(errorState.isVisible).toBeTruthy()
  })

  test('4.5 Password Missing Uppercase Letter', async ({ page }) => {
    const authPage = pageManager.getAuthPage()

    await authPage.navigateToLogin()

    await authPage.fillEmail('test@davesawatzky.com')
    await authPage.blurEmail()

    // Enter password without uppercase
    await authPage.fillPassword('nouppercase1!')
    await authPage.blurPassword()
    await authPage.clickSignIn()
    await page.waitForSelector(
      'text=Password must contain at least 1 uppercase letter'
    )

    const errorState = await authPage.getValidationErrorText(
      'Password must contain at least 1 uppercase letter'
    )
    expect.soft(errorState.isVisible).toBeTruthy()
  })

  test('4.6 Password Missing Number', async ({ page }) => {
    const authPage = pageManager.getAuthPage()

    await authPage.navigateToLogin()

    await authPage.fillEmail('test@davesawatzky.com')
    await authPage.blurEmail()

    // Enter password without number
    await authPage.fillPassword('NoNumberHere!')
    await authPage.blurPassword()
    await authPage.clickSignIn()
    await page.waitForSelector('text=Password must contain at least 1 number')

    const errorState = await authPage.getValidationErrorText(
      'Password must contain at least 1 number'
    )
    expect.soft(errorState.isVisible).toBeTruthy()
  })

  test('4.7 Password Missing Symbol', async ({ page }) => {
    const authPage = pageManager.getAuthPage()

    await authPage.navigateToLogin()

    await authPage.fillEmail('test@davesawatzky.com')
    await authPage.blurEmail()

    // Enter password without symbol
    await authPage.fillPassword('NoSymbol1')
    await authPage.blurPassword()
    await authPage.clickSignIn()
    await page.waitForSelector('text=Password must contain at least 1 symbol')

    const errorState = await authPage.getValidationErrorText(
      'Password must contain at least 1 symbol'
    )
    expect.soft(errorState.isVisible).toBeTruthy()
  })
})

test.describe('Route Protection & Authorization', () => {
  let pageManager: PageManager

  test.beforeEach(async ({ page, context }) => {
    // Clear storage state to ensure clean slate
    await context.clearCookies()
    pageManager = new PageManager(page)
  })

  test('6.1 Access Protected Route While Unauthenticated', async () => {
    const authPage = pageManager.getAuthPage()

    // Navigate directly to protected route
    await authPage.navigateToProtectedRoute('/Form')

    // Wait for redirect and form to load
    await authPage.page.waitForLoadState('domcontentloaded')
    await expect.soft(authPage.signInButton).toBeVisible()

    // Verify redirect to login
    const url = await authPage.getCurrentUrl()
    expect.soft(url).toContain('/login')

    // Verify login form is displayed
    const formState = await authPage.isLoginFormVisible()
    expect.soft(formState.email).toBeTruthy()
    expect.soft(formState.password).toBeTruthy()
    expect.soft(formState.signInButton).toBeTruthy()
  })
})

test.describe('Navigation & User Experience', () => {
  let pageManager: PageManager

  test.beforeEach(async ({ page, context }) => {
    // Clear storage state to ensure clean slate
    await context.clearCookies()
    pageManager = new PageManager(page)
  })

  test('7.1 Toggle Between Sign In and Sign Up Forms', async () => {
    const authPage = pageManager.getAuthPage()

    // Navigate to login page
    await authPage.navigateToLogin()
    await authPage.page.waitForLoadState('domcontentloaded')

    // Wait for form to be visible
    await expect.soft(authPage.signInButton).toBeVisible()

    // Verify sign-in form is displayed by default
    const loginFormState = await authPage.isLoginFormVisible()
    expect.soft(loginFormState.email).toBeTruthy()
    expect.soft(loginFormState.password).toBeTruthy()
    expect.soft(loginFormState.signInButton).toBeTruthy()
    expect.soft(loginFormState.signUpLink).toBeTruthy()

    // Click "Sign up here" link
    await authPage.clickSignUpLink()

    // Wait for registration form to appear
    await expect.soft(authPage.privateTeacherCheckbox).toBeVisible()

    // Verify registration form is displayed
    const regFormState = await authPage.isRegistrationFormVisible()
    expect.soft(regFormState.email).toBeTruthy()
    expect.soft(regFormState.password).toBeTruthy()
    expect.soft(regFormState.confirmPassword).toBeTruthy()
    expect.soft(regFormState.privateTeacherCheckbox).toBeTruthy()
    expect.soft(regFormState.schoolTeacherCheckbox).toBeTruthy()

    // Click "Back to Sign In" link
    await authPage.clickBackToSignIn()

    // Wait for sign-in form to appear
    await expect.soft(authPage.signInButton).toBeVisible()

    // Verify sign-in form is displayed again
    const backToLoginState = await authPage.isLoginFormVisible()
    expect.soft(backToLoginState.signInButton).toBeTruthy()
  })
})

test.describe('Session Management', () => {
  let pageManager: PageManager

  test.beforeEach(async ({ page }) => {
    // Don't clear cookies - these tests need to establish and test authenticated sessions
    pageManager = new PageManager(page)
  })

  test('5.1 Session Persistence on Page Refresh', async ({ page }) => {
    const authPage = pageManager.getAuthPage()

    // Login
    await authPage.navigateToLogin()
    await authPage.login('existing.user@davesawatzky.com', 'ExistingPass123!')
    await page.waitForURL(/.*registrations/)

    // Refresh the page
    await page.reload()

    // Verify user is still authenticated (remains on protected page)
    await page.waitForLoadState('networkidle')
    const url = await authPage.getCurrentUrl()
    expect.soft(url).toContain('/registrations')

    // Cleanup
    await authPage.logout()
  })

  test('5.2 Logout Functionality', async ({ page }) => {
    const authPage = pageManager.getAuthPage()

    // Login
    await authPage.navigateToLogin()
    await authPage.login('existing.user@davesawatzky.com', 'ExistingPass123!')
    await page.waitForURL(/.*registrations/)

    // Logout
    await authPage.logout()

    // Wait for redirect
    await page.waitForURL('/login')

    // Verify redirected to login page
    const url = await authPage.getCurrentUrl()
    expect.soft(url).toContain('/login')

    // Try to access protected route - should redirect to login
    await authPage.navigateToProtectedRoute('/Form')
    await page.waitForURL(/.*login/)
    expect.soft(page.url()).toContain('/login')
  })
})
