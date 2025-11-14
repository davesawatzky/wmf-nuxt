import { expect } from '@playwright/test'
import { HelperBase } from './helperBase'

/**
 * Page Object Model for Email Confirmation page
 * Handles email verification token flows
 */
export class EmailConfirmationPage extends HelperBase {
  // Locators
  private readonly heading = () => this.page.locator('h3')
  private readonly messageText = () => this.page.locator('p')
  private readonly continueButton = () =>
    this.page.getByRole('button', { name: /proceed to sign in/i })
  private readonly resendButton = () =>
    this.page.getByRole('button', { name: /resend/i })
  private readonly returnToLoginLink = () =>
    this.page.getByRole('link', { name: /return to login/i })

  /**
   * Navigate to email confirmation page with token
   */
  async gotoWithToken(token: string) {
    await this.page.goto(`/EmailConfirmation?token=${token}`)
    await this.page.waitForLoadState('networkidle')
  }

  /**
   * Navigate without token (should show error)
   */
  async gotoWithoutToken() {
    await this.page.goto('/EmailConfirmation')
    await this.page.waitForLoadState('networkidle')
  }

  /**
   * Verify successful email verification
   */
  async verifySuccessMessage() {
    await expect(this.heading()).toContainText(/account is verified/i)
    await expect(this.continueButton()).toBeVisible()
  }

  /**
   * Verify expired token message
   */
  async verifyExpiredTokenMessage() {
    await expect(this.heading()).toContainText(
      /email confirmation token expired/i
    )
    await expect(this.continueButton()).toBeVisible()
  }

  /**
   * Verify invalid token message
   */
  async verifyInvalidTokenMessage() {
    await expect(this.heading()).toContainText(/bad confirmation token/i)
    await expect(this.continueButton()).toBeVisible()
  }

  /**
   * Click continue to proceed to login
   */
  async clickContinue() {
    await this.continueButton().click()
  }

  /**
   * Click resend verification email
   */
  async clickResend() {
    await this.resendButton().click()
  }

  /**
   * Click return to login
   */
  async clickReturnToLogin() {
    await this.returnToLoginLink().click()
  }

  /**
   * Verify redirect to login page
   */
  async verifyRedirectToLogin() {
    await this.page.waitForURL('**/login', { timeout: 5000 })
    await expect(this.page).toHaveURL(/\/login/)
  }

  /**
   * Verify redirect to registrations page (for verified users)
   */
  async verifyRedirectToRegistrations() {
    await this.page.waitForURL('**/registrations', { timeout: 5000 })
    await expect(this.page).toHaveURL(/\/registrations/)
  }

  /**
   * Get current page heading text
   */
  async getHeadingText(): Promise<string> {
    return (await this.heading().textContent()) || ''
  }

  /**
   * Get current message text
   */
  async getMessageText(): Promise<string> {
    return (await this.messageText().textContent()) || ''
  }
}
