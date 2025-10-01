import type { Locator, Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { HelperBase } from './helperBase'

export class AuthPage extends HelperBase {
  private readonly emailInput: Locator
  private readonly passwordInput: Locator
  private readonly signInButton: Locator

  constructor(page: Page) {
    super(page)
    this.emailInput = page.getByLabel('Email')
    this.passwordInput = page.getByLabel('Password')
    this.signInButton = page.getByRole('button', { name: 'Sign In' })
  }

  private async loginEmail(email: string) {
    await this.emailInput.focus()
    await this.emailInput.fill(email)
    await this.emailInput.blur()
  }

  private async loginPassword(password: string) {
    await this.passwordInput.focus()
    await this.passwordInput.fill(password)
    await this.passwordInput.blur()
  }

  /**
   * Should redirect to login when not authenticated
   */
  async shouldRedirectToLoginWhenNotAuthenticated() {
    await this.page.goto('/form')
    await expect(this.page).toHaveURL(/.*login/)
  }

  /**
   * Should display login form
   */
  async shouldDisplayLoginForm() {
    await this.page.goto('/login')
    await expect(this.emailInput).toBeVisible({ timeout: 30000 })
    await expect(this.passwordInput).toBeVisible({ timeout: 30000 })
    await expect(this.signInButton).toBeVisible({ timeout: 30000 })
  }

  /**
   * Should show validation errors for invalid login (empty fields)
   */
  async shouldShowValidationErrorsForInvalidLogin() {
    await this.page.goto('/login')
    await this.signInButton.click()
    await expect(this.page.getByText('Email is a required field')).toBeVisible()
    await expect(
      this.page.getByText('Password must be at least 8 characters')
    ).toBeVisible()
  }

  /**
   * Should check for short password
   * @param testEmail - should not exist in the system
   * @param initialPassword1 - any password used to trigger validation
   * @param invalidPassword - password that is too short (e.g., "short")
   */
  async shouldCheckForShortPassword(
    testEmail: string,
    initialPassword1: string,
    invalidPassword: string
  ) {
    await this.page.goto('/login')
    await this.loginEmail(testEmail)
    await this.loginPassword(initialPassword1)
    await this.signInButton.click()
    await expect
      .soft(this.page.getByText('Password is a required field'))
      .toBeVisible()
    await this.passwordInput.focus()
    await this.passwordInput.fill(invalidPassword)
    await expect(
      this.page.getByText('Password must be at least 8 characters')
    ).toBeVisible()
  }

  /**
   * Should show error message for password lacking a Capital letter
   * @param testEmail - should not exist in the system
   * @param initialPassword - any password used to trigger validation
   * @param invalidPassword - password lacking a capital letter (e.g., "nouppercase1")
   */
  async shouldShowErrorMessageForPasswordLackingCapitalLetter(
    testEmail: string,
    initialPassword: string,
    invalidPassword: string
  ) {
    await this.page.goto('/login')
    await this.loginEmail(testEmail)
    await this.loginPassword(initialPassword)
    await this.signInButton.click()
    await expect
      .soft(this.page.getByText('Password is a required field'))
      .toBeVisible()
    await this.passwordInput.focus()
    await this.passwordInput.fill(invalidPassword)
    await expect(
      this.page.getByText('Password must contain at least 1 uppercase letter')
    ).toBeVisible()
  }

  /**
   * Should show error message for password lacking a number character
   * @param testEmail - should not exist in the system
   * @param initialPassword - any password used to trigger validation
   * @param invalidPassword - password lacking a number character (e.g., "NoNumberHere!"
   */
  async shouldShowErrorForPasswordLackingNumber(
    testEmail: string,
    initialPassword: string,
    invalidPassword: string
  ) {
    await this.page.goto('/login')
    await this.loginEmail(testEmail)
    await this.loginPassword(initialPassword)
    await this.signInButton.click()
    await expect
      .soft(this.page.getByText('Password is a required field'))
      .toBeVisible()
    await this.passwordInput.focus()
    await this.passwordInput.fill(invalidPassword)
    await expect(
      this.page.getByText('Password must contain at least 1 number')
    ).toBeVisible()
  }

  /**
   * Should show error message for password lacking a symbol character
   * @param testEmail - should not exist in the system
   * @param initialPassword - any password used to trigger validation
   * @param invalidPassword - password lacking a symbol character (e.g., "NoSymbol1"
   */
  async shouldShowErrorForPasswordLackingSymbol(
    testEmail: string,
    initialPassword: string,
    invalidPassword: string
  ) {
    await this.page.goto('/login')
    await this.loginEmail(testEmail)
    await this.loginPassword(initialPassword)
    await this.signInButton.click()
    await expect
      .soft(this.page.getByText('Password is a required field'))
      .toBeVisible()
    await this.passwordInput.focus()
    await this.passwordInput.fill(invalidPassword)
    await expect(
      this.page.getByText('Password must contain at least 1 symbol')
    ).toBeVisible()
  }

  /**
   * Should show error message for incorrect credentials
   * @param testEmail  - should not exist in the system
   * @param password - any password fulfilling the validation rules
   */
  async shouldShowErrorMessageForIncorrectCredentials(
    testEmail: string,
    password: string
  ) {
    await this.page.goto('/login')
    await this.loginEmail(testEmail)
    await this.loginPassword(password)
    await this.signInButton.click()
    await expect(
      this.page.getByText('Incorrect email or password')
    ).toBeVisible({
      timeout: 3000,
    })
  }

  async shouldLoadRegistrationPageAfterLogin(email: string, password: string) {
    await this.page.goto('/login')
    await this.loginEmail(email)
    await this.loginPassword(password)
    await this.signInButton.click()
    await expect(this.page).toHaveURL(/.*registrations/, {
      timeout: 30000,
    })
    if (this.page.url().includes('/registrations')) {
      await this.page.getByRole('button', { name: 'Account' }).click()
      await this.page.getByRole('button', { name: 'Sign Out' }).click()
      await expect(this.page).toHaveURL('/login')
    }
  }

  async signUpPrivateTeacher(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    await this.page.goto('/login')
    await this.page.getByRole('button', { name: 'Sign up here.' }).click()
    await this.page.getByRole('checkbox', { name: 'Private Teacher' }).check()
    await expect(this.page.getByLabel('Instrument(s)')).toBeVisible()

    await this.page.getByLabel('First Name').click()
    await this.page.getByLabel('First Name').fill(firstName)
    await this.page.getByLabel('Last Name').click()
    await this.page.getByLabel('Last Name').fill(lastName)
    await this.page.getByLabel('Instrument(s)').selectOption('Clarinet')
    await this.page.getByLabel('Email').click()
    await this.page.getByLabel('Email').fill(email)
    await this.page.getByLabel('Password').first().focus()
    await this.page.getByLabel('Password').first().fill(password)
    await this.page.getByLabel('Re-enter Password', { exact: true }).focus()
    await this.page
      .getByLabel('Re-enter Password', { exact: true })
      .fill(password)
    await this.page
      .getByRole('button', { name: 'Register New Account' })
      .click()
    await expect(
      this.page.getByText('Check Email for account verification link')
    ).toBeVisible({
      timeout: 10000,
    })
    await expect(this.page).toHaveURL(/.*login/, {
      timeout: 30000,
    })
  }
}
