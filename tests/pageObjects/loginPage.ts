import { expect } from '@playwright/test'
import { HelperBase } from './helperBase'

/**
 * Page Object Model for Login/Sign Up page
 * Handles all authentication-related interactions
 */
export class LoginPage extends HelperBase {
  // Locators
  private readonly emailInput = () => this.page.locator('input[name="email"]')
  private readonly passwordInput = () =>
    this.page.locator('input[name="password"]')
  private readonly password2Input = () =>
    this.page.locator('input[name="password2"]')
  private readonly firstNameInput = () =>
    this.page.locator('input[name="firstName"]')
  private readonly lastNameInput = () =>
    this.page.locator('input[name="lastName"]')
  private readonly instrumentSelect = () =>
    this.page.locator('select[name="instrument"]')

  private readonly privateTeacherCheckbox = () =>
    this.page.locator('input[name="privateTeacher"]')
  private readonly schoolTeacherCheckbox = () =>
    this.page.locator('input[name="schoolTeacher"]')

  private readonly signInButton = () =>
    this.page.getByRole('button', { name: 'Sign In', exact: true })
  private readonly registerButton = () =>
    this.page.getByRole('button', { name: /register new account/i })
  private readonly signUpLink = () =>
    this.page.getByRole('button', { name: /sign up here/i })
  private readonly backToSignInButton = () =>
    this.page.getByRole('button', { name: /back to sign in/i })

  private readonly forgotPasswordLink = () =>
    this.page.getByRole('link', { name: /forgot your password/i })

  // Dialog locators
  private readonly dialog = () =>
    this.page.locator('Vue-Toastification__container')
  private readonly dialogCloseButton = () =>
    this.dialog().getByRole('button', { name: /close/i })
  private readonly resendVerificationButton = () =>
    this.dialog().getByRole('button', { name: /re-send verification/i })
  private readonly resendPasswordButton = () =>
    this.dialog().getByRole('button', {
      name: /re-send password change email/i,
    })

  /**
   * Navigate to the login page
   */
  async goto() {
    await this.page.goto('/login')
    await this.page.waitForLoadState('networkidle')
  }

  /**
   * Switch to sign up form
   */
  async showSignUpForm() {
    await this.signUpLink().click()
    await this.page.waitForTimeout(300) // Wait for animation
  }

  /**
   * Switch to sign in form
   */
  async showSignInForm() {
    await this.backToSignInButton().click()
    await this.page.waitForTimeout(300) // Wait for animation
  }

  /**
   * Fill in sign in credentials
   */
  async fillSignInForm(email: string, password: string) {
    await this.emailInput().fill(email)
    await this.passwordInput().fill(password)
  }

  /**
   * Fill in sign up form for regular user
   */
  async fillSignUpFormRegularUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    await this.firstNameInput().fill(firstName)
    await this.lastNameInput().fill(lastName)
    await this.emailInput().fill(email)
    await this.passwordInput().fill(password)
    await this.password2Input().fill(password)
  }

  /**
   * Fill in sign up form for private teacher
   */
  async fillSignUpFormPrivateTeacher(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    instrument: string
  ) {
    await this.privateTeacherCheckbox().check()
    await this.page.waitForTimeout(200) // Wait for instrument dropdown to appear

    await this.firstNameInput().fill(firstName)
    await this.lastNameInput().fill(lastName)
    await this.instrumentSelect().selectOption({ label: instrument })
    await this.emailInput().fill(email)
    await this.passwordInput().fill(password)
    await this.password2Input().fill(password)
  }

  /**
   * Fill in sign up form for school teacher
   */
  async fillSignUpFormSchoolTeacher(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    await this.schoolTeacherCheckbox().check()

    await this.firstNameInput().fill(firstName)
    await this.lastNameInput().fill(lastName)
    await this.emailInput().fill(email)
    await this.passwordInput().fill(password)
    await this.password2Input().fill(password)
  }

  /**
   * Fill in sign up form for both teacher types
   */
  async fillSignUpFormBothTeachers(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    instrument: string
  ) {
    await this.privateTeacherCheckbox().check()
    await this.schoolTeacherCheckbox().check()
    await this.page.waitForTimeout(200) // Wait for instrument dropdown

    await this.firstNameInput().fill(firstName)
    await this.lastNameInput().fill(lastName)
    await this.instrumentSelect().selectOption({ label: instrument })
    await this.emailInput().fill(email)
    await this.passwordInput().fill(password)
    await this.password2Input().fill(password)
  }

  /**
   * Submit sign in form
   */
  async submitSignIn() {
    await this.signInButton().click()
  }

  /**
   * Submit registration form
   */
  async submitRegistration() {
    await this.registerButton().click()
  }

  /**
   * Sign in with credentials
   */
  async signIn(email: string, password: string) {
    await this.fillSignInForm(email, password)
    await this.submitSignIn()
  }

  /**
   * Register regular user account
   */
  async registerRegularUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    await this.showSignUpForm()
    await this.fillSignUpFormRegularUser(firstName, lastName, email, password)
    await this.submitRegistration()
  }

  /**
   * Register private teacher account
   */
  async registerPrivateTeacher(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    instrument: string
  ) {
    await this.showSignUpForm()
    await this.fillSignUpFormPrivateTeacher(
      firstName,
      lastName,
      email,
      password,
      instrument
    )
    await this.submitRegistration()
  }

  /**
   * Register school teacher account
   */
  async registerSchoolTeacher(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    await this.showSignUpForm()
    await this.fillSignUpFormSchoolTeacher(firstName, lastName, email, password)
    await this.submitRegistration()
  }

  /**
   * Verify successful sign in by checking redirect
   */
  async verifySuccessfulSignIn(expectedUrl: string = '/registrations') {
    await this.page.waitForURL(`**${expectedUrl}**`, { timeout: 10000 })
    await expect(this.page).toHaveURL(new RegExp(expectedUrl))
  }

  /**
   * Verify successful registration by checking toast message
   */
  async verifySuccessfulRegistration() {
    // Wait for toast notification
    const toast = this.page.locator('.Vue-Toastification__toast--success')
    await expect(toast).toContainText(/check email/i)

    // Should be back on sign in form
    await expect(this.signInButton()).toBeVisible()
  }

  /**
   * Verify validation error on a specific field
   */
  async verifyValidationError(fieldName: string, errorMessage: string) {
    const field = this.page.locator(`input[name="${fieldName}"]`)
    const errorText = field
      .locator('..')
      .locator('.error-message, [class*="error"]')
    await expect(errorText).toContainText(errorMessage, { timeout: 5000 })
  }

  /**
   * Verify email format validation error
   */
  async verifyEmailFormatError() {
    await this.emailInput().blur()
    await this.page.waitForTimeout(500)
    const errorText = this.page.locator('text=/email must be a valid email/i')
    await expect(errorText).toBeVisible()
  }

  /**
   * Verify password validation error
   */
  async verifyPasswordError(errorPattern: RegExp) {
    await this.passwordInput().blur()
    await this.page.waitForTimeout(500)
    const errorText = this.page.locator(`text=${errorPattern}`)
    await expect(errorText).toBeVisible()
  }

  /**
   * Verify password mismatch error
   */
  async verifyPasswordMismatchError() {
    await this.password2Input().blur()
    await this.page.waitForTimeout(500)
    const errorText = this.page.locator('text=/passwords must match/i')
    await expect(errorText).toBeVisible()
  }

  /**
   * Check if dialog is visible with specific message
   */
  async verifyDialogVisible(headerText: string | RegExp) {
    await expect(this.dialog()).toBeVisible()
    await expect(this.dialog().locator('h3')).toContainText(headerText)
  }

  /**
   * Verify unverified account dialog
   */
  async verifyUnverifiedAccountDialog() {
    await this.verifyDialogVisible(/account not verified/i)
    await expect(this.dialog()).toContainText(/check your email inbox/i)
  }

  /**
   * Verify password reset pending dialog
   */
  async verifyPasswordResetDialog() {
    await this.verifyDialogVisible(/password change pending/i)
    await expect(this.dialog()).toContainText(
      /password change has been requested/i
    )
  }

  /**
   * Click resend verification email button in dialog
   */
  async clickResendVerification() {
    await this.resendVerificationButton().click()
  }

  /**
   * Click resend password reset button in dialog
   */
  async clickResendPasswordReset() {
    await this.resendPasswordButton().click()
  }

  /**
   * Close dialog
   */
  async closeDialog() {
    await this.dialogCloseButton().click()
  }

  /**
   * Verify toast error message
   */
  async verifyToastError(message: string | RegExp) {
    const toast = this.page.locator('.Vue-Toastification__toast--error')
    await expect(toast).toContainText(message)
  }

  /**
   * Verify toast success message
   */
  async verifyToastSuccess(message: string | RegExp) {
    const toast = this.page.locator('.Vue-Toastification__toast--success')
    await expect(toast).toContainText(message)
  }

  /**
   * Navigate to forgot password page
   */
  async clickForgotPassword() {
    await this.forgotPasswordLink().click()
  }

  /**
   * Check if private teacher checkbox is checked
   */
  async isPrivateTeacherChecked(): Promise<boolean> {
    return await this.privateTeacherCheckbox().isChecked()
  }

  /**
   * Check if school teacher checkbox is checked
   */
  async isSchoolTeacherChecked(): Promise<boolean> {
    return await this.schoolTeacherCheckbox().isChecked()
  }

  /**
   * Check if instrument dropdown is visible
   */
  async isInstrumentDropdownVisible(): Promise<boolean> {
    return await this.instrumentSelect().isVisible()
  }

  /**
   * Check if register button is enabled
   */
  async isRegisterButtonEnabled(): Promise<boolean> {
    return await this.registerButton().isEnabled()
  }

  /**
   * Get all available instruments from dropdown
   */
  async getAvailableInstruments(): Promise<string[]> {
    const options = await this.instrumentSelect()
      .locator('option')
      .allTextContents()
    return options.filter((opt) => opt.trim() !== '')
  }

  /**
   * Wait for form to be cleared
   */
  async waitForFormClear() {
    await this.page.waitForTimeout(4000) // Wait for auto-clear timeout
    await expect(this.emailInput()).toHaveValue('')
  }
}
