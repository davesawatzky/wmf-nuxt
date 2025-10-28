import type { Locator, Page } from '@playwright/test'
import { HelperBase } from './helperBase'

export class AuthPage extends HelperBase {
  // Locators
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly confirmPasswordInput: Locator
  readonly signInButton: Locator
  readonly signUpLink: Locator
  readonly signUpButton: Locator
  readonly backToSignInLink: Locator
  readonly privateTeacherCheckbox: Locator
  readonly schoolTeacherCheckbox: Locator
  readonly firstNameInput: Locator
  readonly lastNameInput: Locator
  readonly instrumentSelect: Locator

  constructor(page: Page) {
    super(page)
    this.emailInput = page.getByRole('textbox', { name: 'Email' })
    this.passwordInput = page.getByRole('textbox', { name: 'Password' }).first()
    this.confirmPasswordInput = page.getByRole('textbox', {
      name: 'Re-enter Password',
    })
    this.signInButton = page.getByRole('button', {
      name: 'Sign In',
      exact: true,
    })
    this.signUpLink = page.getByRole('button', { name: 'Sign up here.' })
    this.signUpButton = page.getByRole('button', {
      name: 'Register New Account',
    })
    this.backToSignInLink = page.getByRole('button', {
      name: 'Back to Sign In',
    })
    this.privateTeacherCheckbox = page.getByRole('checkbox', {
      name: 'Private Teacher',
    })
    this.schoolTeacherCheckbox = page.getByRole('checkbox', {
      name: 'School Teacher',
    })
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name' })
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' })
    this.instrumentSelect = page.getByLabel('Instrument(s)')
  }

  // Navigation methods
  async navigateToLogin() {
    await this.page.goto('/login')
  }

  async navigateToProtectedRoute(route: string) {
    await this.page.goto(route)
  }

  // Form interaction methods - Login
  async fillEmail(email: string) {
    await this.emailInput.focus()
    await this.emailInput.fill(email)
  }

  async fillPassword(password: string) {
    await this.passwordInput.focus()
    await this.passwordInput.fill(password)
  }

  async blurEmail() {
    await this.emailInput.blur()
  }

  async blurPassword() {
    await this.passwordInput.blur()
  }

  async clickSignIn() {
    await this.signInButton.click()
  }

  async pressEnterOnPassword() {
    await this.passwordInput.press('Enter')
  }

  // Combined actions
  async login(email: string, password: string) {
    await this.fillEmail(email)
    await this.blurEmail()
    await this.fillPassword(password)
    await this.blurPassword()
    await this.clickSignIn()
  }

  async loginWithEnter(email: string, password: string) {
    await this.fillEmail(email)
    await this.blurEmail()
    await this.fillPassword(password)
    await this.pressEnterOnPassword()
  }

  // Form interaction methods - Registration
  async clickSignUpLink() {
    await this.signUpLink.click()
  }

  async clickBackToSignIn() {
    await this.backToSignInLink.click()
  }

  async fillFirstName(firstName: string) {
    await this.firstNameInput.click()
    await this.firstNameInput.fill(firstName)
  }

  async fillLastName(lastName: string) {
    await this.lastNameInput.click()
    await this.lastNameInput.fill(lastName)
  }

  async fillConfirmPassword(password: string) {
    await this.confirmPasswordInput.focus()
    await this.confirmPasswordInput.fill(password)
  }

  async checkPrivateTeacher() {
    await this.privateTeacherCheckbox.check()
  }

  async checkSchoolTeacher() {
    await this.schoolTeacherCheckbox.check()
  }

  async selectInstrument(instrument: string) {
    await this.instrumentSelect.selectOption(instrument)
  }

  async clickRegisterButton() {
    await this.signUpButton.click()
  }

  // State checking methods (return boolean/data, no assertions)
  async isLoginFormVisible() {
    return {
      email: await this.emailInput.isVisible(),
      password: await this.passwordInput.isVisible(),
      signInButton: await this.signInButton.isVisible(),
      signUpLink: await this.signUpLink.isVisible(),
    }
  }

  async isRegistrationFormVisible() {
    return {
      email: await this.emailInput.isVisible(),
      password: await this.passwordInput.isVisible(),
      confirmPassword: await this.confirmPasswordInput.isVisible(),
      privateTeacherCheckbox: await this.privateTeacherCheckbox.isVisible(),
      schoolTeacherCheckbox: await this.schoolTeacherCheckbox.isVisible(),
      signUpButton: await this.signUpButton.isVisible(),
      backToSignInLink: await this.backToSignInLink.isVisible(),
    }
  }

  async getValidationErrorText(text: string) {
    const locator = this.page.getByText(text, { exact: false })
    return {
      isVisible: await locator.isVisible().catch(() => false),
      text: await locator.textContent().catch(() => null),
    }
  }

  async getAllValidationErrors() {
    // Get all visible error messages
    const errorLocators = this.page.locator('[class*="error"]')
    const count = await errorLocators.count()
    const errors: string[] = []

    for (let i = 0; i < count; i++) {
      const text = await errorLocators.nth(i).textContent()
      if (text) errors.push(text.trim())
    }

    return errors
  }

  async getCurrentUrl() {
    return this.page.url()
  }

  async getEmailInputValue() {
    return await this.emailInput.inputValue()
  }

  async getPasswordInputValue() {
    return await this.passwordInput.inputValue()
  }

  async isSignInButtonDisabled() {
    return await this.signInButton.isDisabled()
  }

  async isSignUpButtonDisabled() {
    return await this.signUpButton.isDisabled()
  }

  // Logout helper
  async logout() {
    await this.page.getByRole('button', { name: 'Account' }).click()
    await this.page.getByRole('button', { name: 'Sign Out' }).click()
  }

  // Full registration flow (for convenience)
  async registerPrivateTeacher(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    instrument: string
  ) {
    await this.navigateToLogin()
    await this.clickSignUpLink()
    await this.checkPrivateTeacher()
    await this.fillFirstName(firstName)
    await this.fillLastName(lastName)
    await this.selectInstrument(instrument)
    await this.fillEmail(email)
    await this.fillPassword(password)
    await this.fillConfirmPassword(password)
    await this.clickRegisterButton()
  }

  async registerSchoolTeacher(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    await this.navigateToLogin()
    await this.clickSignUpLink()
    await this.checkSchoolTeacher()
    await this.fillFirstName(firstName)
    await this.fillLastName(lastName)
    await this.fillEmail(email)
    await this.fillPassword(password)
    await this.fillConfirmPassword(password)
    await this.clickRegisterButton()
  }

  async registerBothTeachers(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    instrument: string
  ) {
    await this.navigateToLogin()
    await this.clickSignUpLink()
    await this.checkPrivateTeacher()
    await this.checkSchoolTeacher()
    await this.fillFirstName(firstName)
    await this.fillLastName(lastName)
    await this.selectInstrument(instrument)
    await this.fillEmail(email)
    await this.fillPassword(password)
    await this.fillConfirmPassword(password)
    await this.clickRegisterButton()
  }
}
